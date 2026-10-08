$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$environmentFile = Join-Path $projectRoot '.env'
$npmCommand = Get-Command npm -ErrorAction SilentlyContinue

if (-not $npmCommand) {
    throw 'Node.js/npm is not installed or not available in PATH. Install Node.js 18 or newer, reopen PowerShell, and run this script again.'
}

if (Test-Path $environmentFile) {
    $overwrite = Read-Host 'A .env file already exists. Replace the current configuration? (y/N)'
    if ($overwrite -notmatch '^(y|yes)$') {
        Write-Host 'The existing configuration was kept.'
        exit 0
    }
}

$accountSid = (Read-Host 'Enter your Twilio Account SID (starts with AC)').Trim()
if ($accountSid -notmatch '^AC[0-9a-fA-F]{32}$') {
    throw 'Invalid Account SID format. Copy the SID starting with AC from the Twilio Console.'
}

$secureToken = Read-Host 'Enter your Twilio Auth Token (input is hidden)' -AsSecureString
if ($secureToken.Length -lt 16) {
    throw 'The Auth Token is invalid or too short.'
}

$fromNumber = (Read-Host 'Enter your SMS-enabled Twilio number in international format, e.g. +1...').Trim()
if ($fromNumber -notmatch '^\+[1-9]\d{7,14}$') {
    throw 'The sender number must use international E.164 format, e.g. +14155552671.'
}

$tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
try {
    $authToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
    $contents = @(
        "TWILIO_ACCOUNT_SID=$accountSid"
        "TWILIO_AUTH_TOKEN=$authToken"
        "TWILIO_FROM_NUMBER=$fromNumber"
        'PORT=3000'
    ) -join "`n"

    $utf8WithoutBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($environmentFile, "$contents`n", $utf8WithoutBom)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
    $authToken = $null
    $contents = $null
}

Set-Location $projectRoot
if (-not (Test-Path (Join-Path $projectRoot 'node_modules\express'))) {
    Write-Host 'Installing project dependencies...'
    & npm install
    if ($LASTEXITCODE -ne 0) {
        throw 'Dependency installation failed. Check your network connection and run this script again.'
    }
}

Write-Host 'Configuration saved to .env (this file is excluded from Git). Starting OCOP Sales Copilot...'
& npm start
