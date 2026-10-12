$ErrorActionPreference = 'Continue'
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$base = 'file:///E:/AmanShariah%20Website/aman-website/'
$log = '_run_tests.log'
"" | Out-File -Encoding utf8 $log

function Run-Chrome($page, $size, $out, $profile) {
    $prof = Join-Path $env:TEMP ("chr_" + $profile)
    if (Test-Path $prof) { Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue }
    $cargs = @('--headless=new', '--disable-gpu', '--no-sandbox',
               "--user-data-dir=$prof",
               '--virtual-time-budget=15000', '--dump-dom', "--window-size=$size", "$base$page")
    Add-Content $log "RUN $page @ $size profile=$profile"
    $txt = & $chrome @cargs 2>&1 | Out-String
    Add-Content $log ("  exit=$LASTEXITCODE  chars=" + $txt.Length)
    $txt | Out-File -Encoding utf8 $out
}

Run-Chrome '_test_nav.html' '1400,900' '_test_out.html' 'p1'
Run-Chrome '_test_mobile.html' '390,844' '_test_mob.html' 'p2'
Get-Content $log

