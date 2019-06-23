const { clipboard } = require('electron');

export default function getCliboard() {
  return clipboard.readText('clipboard');
}
