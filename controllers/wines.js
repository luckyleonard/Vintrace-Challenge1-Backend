const fs = require('fs');
const path = require('path');

const getWineByLot = (lot, wines) => {
  const wineDetail = wines.find((wine) => wine.lotCode === lot);
  return wineDetail;
};

const groupBy = (properties, components) => {
  let groupResult = {};

  if (!components) {
    return groupResult;
  }

  groupResult = components.reduce((previousValue, currentComponent) => {
    const groupName = properties
      .map((property) => currentComponent[property])
      .join(' - ');
    (previousValue[groupName] = previousValue[groupName] || []).push(
      currentComponent
    );
    return previousValue;
  }, {});
  return groupResult;
};

const getBreakdown = (groupResult) => {
  const breakdownResult = [];
  for (const groupKey in groupResult) {
    const percentage = groupResult[groupKey].reduce(
      (previousValue, currentComponent) => {
        return previousValue + currentComponent.percentage;
      },
      0
    );
    breakdownResult.push({ percentage, key: groupKey });
  }
  breakdownResult.sort((a, b) => b.percentage - a.percentage);
  return breakdownResult;
};

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

  getBreakdownByYear(req, res) {
    const { lotCode } = req.params;
    const wineComponents = getWineByLot(lotCode, this.wines).components;
    const groupResult = groupBy(['year'], wineComponents);
    const breakdownResult = getBreakdown(groupResult);
    res.send(breakdownResult);
  }
}

module.exports = new WinesController();
