const fs = require('fs');
const path = require('path');

class WinesController {
  constructor() {
    this.wines = [];
    try {
      const dir = './__DATA__';
      const files = fs.readdirSync(dir);
      files.forEach((fileName) => {
        const filePath = path.resolve(__dirname, `../${dir}/${fileName}`);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.wines.push(JSON.parse(fileContent));
      });
    } catch (e) {
      console.log(`fail to loading json file!`, e);
    }
  }

  getWines(req, res) {
    res.send(this.wines);
  }
}

module.exports = new WinesController();
