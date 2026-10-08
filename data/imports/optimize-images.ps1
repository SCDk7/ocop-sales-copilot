Add-Type -AssemblyName System.Drawing
$catalogFolder = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\images\catalog'))
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
Get-ChildItem -LiteralPath $catalogFolder -File | Where-Object { $_.Extension -in '.jpg', '.png' } | ForEach-Object {
    $file = $_
    $original = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        $scale = [Math]::Min(1, 800 / [Math]::Max($original.Width, $original.Height))
        $width = [Math]::Max(1, [int]($original.Width * $scale))
        $height = [Math]::Max(1, [int]($original.Height * $scale))
        $bitmap = New-Object System.Drawing.Bitmap($width, $height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage($original, 0, 0, $width, $height)
            $temporary = Join-Path $catalogFolder ($file.BaseName + '.optimized' + $file.Extension)
            if ($file.Extension -eq '.jpg') {
                $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
                try { $bitmap.Save($temporary, $jpegCodec, $parameters) } finally { $parameters.Dispose() }
            } else {
                $bitmap.Save($temporary, [System.Drawing.Imaging.ImageFormat]::Png)
            }
        } finally { $graphics.Dispose(); $bitmap.Dispose() }
    } finally { $original.Dispose() }
    if ((Get-Item -LiteralPath $temporary).Length -lt $file.Length) {
        Move-Item -LiteralPath $temporary -Destination $file.FullName -Force
    } else {
        Remove-Item -LiteralPath $temporary
    }
}
