import cors from 'cors';
import express from 'express';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ASSET_ROOT = path.resolve(ROOT_DIR, '../fyp-assets');
const VANDI_ROOT = path.resolve(ROOT_DIR, '../vandi profile');
const PROMPTS_DIR = path.join(ASSET_ROOT, 'prompts');
const PROMPTS_FILE = path.join(PROMPTS_DIR, 'prompts.json');
const PORT = 3457;
const HOST = '0.0.0.0';
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
const mappings = [
    { folder: '../vandi profile', kind: 'vandi', extensions: ['.svg'] },
    { folder: 'videos', kind: 'videos', extensions: ['.mp4'] },
    { folder: 'images', kind: 'images', extensions: ['.png', '.jpg', '.jpeg'] },
    { folder: 'svg', kind: 'svgs', extensions: ['.svg'] },
    { folder: 'audio', kind: 'audio', extensions: ['.mp3', '.wav'] },
    { folder: 'sounds', kind: 'audio', extensions: ['.mp3', '.wav'] },
    { folder: 'logos', kind: 'images', extensions: ['.png', '.jpg', '.jpeg'] },
    { folder: 'logos', kind: 'svgs', extensions: ['.svg'] }
];
const uploadTargetByExtension = {
    '.mp4': 'videos',
    '.png': 'images',
    '.jpg': 'images',
    '.jpeg': 'images',
    '.svg': 'svg',
    '.wav': 'audio',
    '.mp3': 'audio'
};
const isInsideAssets = (candidate) => {
    const normalized = path.resolve(candidate);
    return (normalized.startsWith(`${ASSET_ROOT}${path.sep}`) ||
        normalized === ASSET_ROOT ||
        normalized.startsWith(`${VANDI_ROOT}${path.sep}`) ||
        normalized === VANDI_ROOT);
};
async function ensurePromptsFile() {
    await fs.mkdir(PROMPTS_DIR, { recursive: true });
    try {
        await fs.access(PROMPTS_FILE);
    }
    catch {
        await fs.writeFile(PROMPTS_FILE, '{}\n', 'utf8');
    }
}
async function readPrompts() {
    await ensurePromptsFile();
    try {
        const raw = await fs.readFile(PROMPTS_FILE, 'utf8');
        return raw.trim().length > 0 ? JSON.parse(raw) : {};
    }
    catch {
        return {};
    }
}
async function writePrompts(data) {
    await ensurePromptsFile();
    await fs.writeFile(PROMPTS_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
async function scanFolder(folder, allowedExts) {
    const folderPath = path.join(ASSET_ROOT, folder);
    try {
        const entries = await fs.readdir(folderPath, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
            const full = path.join(folderPath, entry.name);
            if (entry.isDirectory()) {
                const nested = await scanFolder(path.join(folder, entry.name), allowedExts);
                files.push(...nested);
            }
            else {
                const ext = path.extname(entry.name).toLowerCase();
                if (allowedExts.includes(ext)) {
                    files.push(path.join(folder, entry.name));
                }
            }
            if (!isInsideAssets(full)) {
                continue;
            }
        }
        return files;
    }
    catch {
        return [];
    }
}
async function collectAssets() {
    const prompts = await readPrompts();
    const collected = [];
    for (const mapping of mappings) {
        const files = await scanFolder(mapping.folder, mapping.extensions);
        for (const relativePath of files) {
            const normalized = relativePath.replace(/\\/g, '/');
            const fullPath = path.join(ASSET_ROOT, relativePath);
            if (!isInsideAssets(fullPath)) {
                continue;
            }
            const stat = await fs.stat(fullPath);
            const promptType = prompts[normalized]?.type;
            const isVoiceover = mapping.folder === 'audio' && (promptType === 'voiceover' || path.basename(normalized).startsWith('vo-'));
            const kind = isVoiceover ? 'voiceovers' : mapping.kind;
            collected.push({
                kind,
                relativePath: normalized,
                fileName: path.basename(relativePath),
                extension: path.extname(relativePath).toLowerCase(),
                size: stat.size,
                mtimeMs: stat.mtimeMs,
                url: `/api/asset/${encodeURIComponent(normalized)}`
            });
        }
    }
    return collected.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
function getLocalNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        if (!iface) {
            continue;
        }
        for (const address of iface) {
            if (address.family !== 'IPv4' || address.internal) {
                continue;
            }
            return address.address;
        }
    }
    return null;
}
app.get('/api/assets', async (_req, res) => {
    try {
        const assets = await collectAssets();
        res.json({ assets, updatedAt: new Date().toISOString() });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to scan assets', details: String(error) });
    }
});
app.get('/api/network-info', (_req, res) => {
    const ip = getLocalNetworkIp();
    res.json({
        ip,
        port: 5179,
        url: ip ? `http://${ip}:5179` : null
    });
});
app.get('/api/prompts', async (_req, res) => {
    try {
        res.json(await readPrompts());
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to read prompts', details: String(error) });
    }
});
app.put('/api/prompts', async (req, res) => {
    try {
        const body = req.body;
        const prompts = await readPrompts();
        if (body && typeof body === 'object' && 'path' in body && 'entry' in body) {
            const incoming = body;
            const key = incoming.path.replace(/\\/g, '/');
            prompts[key] = incoming.entry;
            await writePrompts(prompts);
            res.json({ ok: true, prompts });
            return;
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            res.status(400).json({ error: 'Invalid payload' });
            return;
        }
        await writePrompts(body);
        res.json({ ok: true, prompts: body });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update prompts', details: String(error) });
    }
});
app.post('/api/upload', express.raw({ type: '*/*', limit: '500mb' }), async (req, res) => {
    try {
        const encoded = req.header('x-file-name');
        if (!encoded) {
            res.status(400).json({ error: 'Missing X-File-Name header' });
            return;
        }
        const fileName = path.basename(decodeURIComponent(encoded));
        const extension = path.extname(fileName).toLowerCase();
        let targetFolder = uploadTargetByExtension[extension];
        if (!targetFolder) {
            res.status(400).json({ error: `Unsupported extension: ${extension || 'unknown'}` });
            return;
        }
        const isAudio = extension === '.wav' || extension === '.mp3';
        if (isAudio) {
            const destination = req.header('destination')?.toLowerCase().trim();
            if (destination === 'audio' || destination === 'voiceover') {
                targetFolder = 'audio';
            }
            else if (destination === 'sounds' || destination === 'sound-effect' || destination === 'sfx') {
                targetFolder = 'sounds';
            }
            else {
                res.status(400).json({
                    error: "Audio uploads require a destination header: 'audio' (voiceover) or 'sounds' (sound effect)."
                });
                return;
            }
        }
        if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
            res.status(400).json({ error: 'Upload body is empty' });
            return;
        }
        const targetDir = path.join(ASSET_ROOT, targetFolder);
        const targetPath = path.join(targetDir, fileName);
        if (!isInsideAssets(targetDir) || !isInsideAssets(targetPath)) {
            res.status(400).json({ error: 'Invalid upload path' });
            return;
        }
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(targetPath, req.body);
        res.status(201).json({
            ok: true,
            fileName,
            extension,
            relativePath: path.relative(ASSET_ROOT, targetPath).replace(/\\/g, '/'),
            targetFolder
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to upload file', details: String(error) });
    }
});
app.get('/api/asset-catalog', async (req, res) => {
    try {
        const catalogPath = path.join(ASSET_ROOT, 'extracted-docs', 'ASSET-CATALOG.md');
        const content = await fs.readFile(catalogPath, 'utf8');
        const query = (String(req.query.q || '')).toLowerCase().trim();
        if (!query) {
            res.type('text/markdown').send(content);
            return;
        }
        // Filter catalog lines matching query
        const lines = content.split('\n');
        const matches = [];
        let currentHeader = '';
        for (const line of lines) {
            if (line.startsWith('#')) {
                currentHeader = line;
                continue;
            }
            if (line.toLowerCase().includes(query)) {
                if (currentHeader && !matches.includes(currentHeader)) {
                    matches.push(currentHeader);
                }
                matches.push(line);
            }
        }
        res.type('text/markdown').send(matches.length > 0 ? matches.join('\n') : `No assets matching "${query}"`);
    }
    catch {
        res.status(404).json({ error: 'Asset catalog not found' });
    }
});
app.get('/api/asset/*', async (req, res) => {
    const encoded = req.params[0] ?? '';
    const decoded = decodeURIComponent(encoded);
    const targetPath = path.resolve(ASSET_ROOT, decoded);
    if (!isInsideAssets(targetPath)) {
        res.status(400).send('Invalid path');
        return;
    }
    try {
        await fs.access(targetPath);
        res.sendFile(targetPath);
    }
    catch {
        res.status(404).send('Asset not found');
    }
});
app.listen(PORT, HOST, async () => {
    await ensurePromptsFile();
    console.log(`Asset API listening on http://${HOST}:${PORT}`);
});
