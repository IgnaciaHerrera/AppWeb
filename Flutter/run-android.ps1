<#
run-android.ps1
Helper PowerShell script to run the Flutter app located in
`Flutter/flutter_application_1` on an Android emulator or device.

Usage:
  .\run-android.ps1                # runs on first available device or launches an emulator
  .\run-android.ps1 -DeviceId id   # run on specific device id

Requirements:
- PowerShell (Windows).
- Flutter CLI available on PATH.
- Android SDK / AVD or a physical device connected.

#>

param(
  [string]$DeviceId = ""
)

try {
  $proj = Join-Path $PSScriptRoot "flutter_application_1"
  Write-Host "Project folder: $proj"
  Push-Location $proj

  Write-Host "Running: flutter pub get"
  flutter pub get

  if ($DeviceId) {
    $deviceArg = "-d $DeviceId"
    Write-Host "Using explicit device id: $DeviceId"
  } else {
    # Try to detect devices
    Write-Host "Detecting connected devices/emulators..."
    $devicesJson = flutter devices --machine 2>$null
    $deviceArg = ""
    if ($LASTEXITCODE -eq 0 -and $devicesJson) {
      try {
        $devices = $devicesJson | ConvertFrom-Json
      } catch {
        $devices = @()
      }
      if ($devices.Count -gt 0) {
        $deviceArg = "-d " + $devices[0].id
        Write-Host "Found device: $($devices[0].name) ($($devices[0].id))"
      }
    }

    if (-not $deviceArg) {
      Write-Host "No devices found. Trying to list emulators..."
      $emJson = flutter emulators --machine 2>$null
      if ($LASTEXITCODE -eq 0 -and $emJson) {
        try { $ems = $emJson | ConvertFrom-Json } catch { $ems = @() }
        if ($ems.Count -gt 0) {
          $emId = $ems[0].id
          Write-Host "Launching emulator: $($ems[0].name) ($emId)"
          flutter emulators --launch $emId
          # allow a few seconds for emulator to boot
          Start-Sleep -Seconds 6
        } else {
          Write-Host "No emulators available. Please create one in AVD Manager or connect a device."
        }
      } else {
        Write-Host "flutter emulators failed or returned no emulators. Start an AVD or connect a device."
      }
    }
  }

  Write-Host "Running: flutter run $deviceArg"
  & flutter run $deviceArg

} finally {
  Pop-Location
}

Write-Host "Finished run-android.ps1"
