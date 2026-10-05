$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$environmentFile = Join-Path $projectRoot '.env'
$npmCommand = Get-Command npm -ErrorAction SilentlyContinue
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeCommand -and (Test-Path (Join-Path $env:ProgramFiles 'nodejs\node.exe'))) {
    $env:Path = "$(Join-Path $env:ProgramFiles 'nodejs');$env:Path"
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
}
if (Test-Path (Join-Path $env:ProgramFiles 'nodejs\npm.cmd')) {
    $npmPath = Join-Path $env:ProgramFiles 'nodejs\npm.cmd'
    if (-not $npmCommand) {
        $npmCommand = Get-Item $npmPath
    }
} elseif ($npmCommand) {
    $npmPath = $npmCommand.Source
}
if (-not $nodeCommand -or -not $npmCommand) {
    throw 'Node.js/npm is not available. Install Node.js 18 or newer, reopen PowerShell, and run this script again.'
}

$secureApiKey = Read-Host 'Enter your Google AI Studio Gemini API key (input is hidden)' -AsSecureString
if ($secureApiKey.Length -lt 20) {
    $secureApiKey.Dispose()
    throw 'The Gemini API key is empty or too short. Create a key in Google AI Studio and try again.'
}

$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureApiKey)
try {
    $apiKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
    if ($apiKey -match '[\s#''"]') {
        throw 'The key contains whitespace or quote characters. Copy only the API key from Google AI Studio and try again.'
    }

    $model = 'gemini-2.5-flash'
    if (Test-Path $environmentFile) {
        foreach ($line in [System.IO.File]::ReadAllLines($environmentFile)) {
            if ($line -match '^\s*GEMINI_MODEL\s*=\s*([^#\s]+)') {
                $model = $matches[1].Trim('"').Trim("'")
            }
        }
    }
    $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/$($model):generateContent?key=$([uri]::EscapeDataString($apiKey))"
    $testRequest = @{
        contents = @(@{ role = 'user'; parts = @(@{ text = 'Reply with the single word OK.' }) })
        generationConfig = @{ maxOutputTokens = 8; temperature = 0 }
    } | ConvertTo-Json -Depth 6 -Compress
    try {
        $testResponse = Invoke-RestMethod -Uri $endpoint -Method Post -ContentType 'application/json' -Body $testRequest -TimeoutSec 30 -ErrorAction Stop
    } catch {
        throw 'Google rejected this Gemini API key or model. Create/copy a valid key from Google AI Studio, verify the selected model is available, then run this script again. The existing .env was not changed.'
    }
    if (-not $testResponse.candidates -or -not $testResponse.candidates[0].content.parts) {
        throw 'Gemini did not return a valid test response. The existing .env was not changed.'
    }

    $lines = if (Test-Path $environmentFile) {
        [System.IO.File]::ReadAllLines($environmentFile)
    } else {
        @('# Local environment configuration. Do not commit this file.')
    }
    $preservedLines = @($lines | Where-Object { $_ -notmatch '^\s*GEMINI_API_KEY\s*=' })
    $contents = (@($preservedLines) + "GEMINI_API_KEY=$apiKey") -join "`n"
    $utf8WithoutBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText($environmentFile, "$contents`n", $utf8WithoutBom)
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
    $secureApiKey.Dispose()
    $apiKey = $null
    $contents = $null
    $testRequest = $null
    $testResponse = $null
    $endpoint = $null
}

Set-Location $projectRoot
if (-not (Test-Path (Join-Path $projectRoot 'node_modules\express'))) {
    Write-Host 'Installing project dependencies...'
    & $npmPath install
    if ($LASTEXITCODE -ne 0) {
        throw 'Dependency installation failed. Check your network connection and run this script again.'
    }
}

Write-Host 'Gemini configuration saved locally in .env (excluded from Git). Starting OCOP Sales Copilot...'
if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
    Write-Host 'A service is already listening on port 3000. No second server was started; restart the OCOP server in its existing terminal to load the new key.'
    exit 0
}
& $npmPath start
