function Download-WikimediaSvf {
    param (
        [string]$Filename,
        [string]$OutFile
    )
    
    $api = "https://en.wikipedia.org/w/api.php?action=query&titles=$Filename&prop=imageinfo&iiprop=url&format=json"
    try {
        $resp = Invoke-RestMethod -Uri $api
        $page = $resp.query.pages.psobject.properties.value[0]
        if ($page.imageinfo) {
            $url = $page.imageinfo[0].url
            Invoke-WebRequest -Uri $url -OutFile $OutFile
            Write-Host "Downloaded $OutFile from en.wikipedia"
            return
        }
    } catch {}

    $api = "https://commons.wikimedia.org/w/api.php?action=query&titles=$Filename&prop=imageinfo&iiprop=url&format=json"
    try {
        $resp = Invoke-RestMethod -Uri $api
        $page = $resp.query.pages.psobject.properties.value[0]
        if ($page.imageinfo) {
            $url = $page.imageinfo[0].url
            Invoke-WebRequest -Uri $url -OutFile $OutFile
            Write-Host "Downloaded $OutFile from commons"
            return
        }
    } catch {}
    
    Write-Host "Failed to find $Filename"
}

Download-WikimediaSvf -Filename "File:UK_traffic_sign_545.svg" -OutFile "children_crossing.svg"
Download-WikimediaSvf -Filename "File:UK_traffic_sign_606_(right).svg" -OutFile "turn_right.svg"
Download-WikimediaSvf -Filename "File:Zeichen_350_-_Fußgängerüberweg,_StVO_1992.svg" -OutFile "pedestrian_crossing.svg"

$stopSvg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="190" fill="#cc0000" stroke="#ffffff" stroke-width="10" />
  <circle cx="200" cy="200" r="195" fill="none" stroke="#000000" stroke-width="2" />
  <text x="200" y="240" font-family="Impact, 'Arial Black', sans-serif" font-weight="900" font-size="130" fill="#ffffff" text-anchor="middle" letter-spacing="-2">STOP</text>
</svg>
"@
Set-Content -Path "stop_sign.svg" -Value $stopSvg
Write-Host "Created stop_sign.svg manually"
