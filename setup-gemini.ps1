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
    $apiKey = $null
    $contents = $null
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
& $npmPath start
