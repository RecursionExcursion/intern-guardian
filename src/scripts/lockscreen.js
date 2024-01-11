const { exec } = require('child_process');

function lockScreen() {
  exec('powershell.exe -Command "$obj = New-Object -ComObject WScript.Shell; $obj.Run(\'rundll32.exe user32.dll,LockWorkStation\')"');
}

module.exports = lockScreen;

if (require.main === module) {
  lockScreen();
}