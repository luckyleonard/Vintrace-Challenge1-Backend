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
      .map((property) => {
        return currentComponent[property] ? currentComponent[property] : '';
      })
      .join('-');
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

const getBreakdownBy = (properties, lotCode, wines) => {
  const wineComponents = getWineByLot(lotCode, wines).components;
  const groupResult = groupBy(properties, wineComponents);
  const breakdownResult = getBreakdown(groupResult);
  return breakdownResult;
};

const getResponseWithBreakdown = (types, breakdown) => {
  return {
    breakdownType: types.join('-'),
    breakdown,
  };
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

  getWineDetail(req, res) {
    const { lotCode } = req.params;
    const wineDetail = getWineByLot(lotCode, this.wines);
    res.json(wineDetail);
  }

  getBreakdownByYear(req, res) {
    const { lotCode } = req.params;
    const properties = ['year'];
    const breakdownResult = getBreakdownBy(properties, lotCode, this.wines);
    res.json(getResponseWithBreakdown(properties, breakdownResult));
  }

  getBreakdownByVariety(req, res) {
    const { lotCode } = req.params;
    const properties = ['variety'];
    const breakdownResult = getBreakdownBy(properties, lotCode, this.wines);
    res.json(getResponseWithBreakdown(properties, breakdownResult));
  }

  getBreakdownByRegion(req, res) {
    const { lotCode } = req.params;
    const properties = ['region'];
    const breakdownResult = getBreakdownBy(properties, lotCode, this.wines);
    res.json(getResponseWithBreakdown(properties, breakdownResult));
  }

  getBreakdownByYearAndVariety(req, res) {
    const { lotCode } = req.params;
    const properties = ['year', 'variety'];
    const breakdownResult = getBreakdownBy(properties, lotCode, this.wines);
    res.json(getResponseWithBreakdown(properties, breakdownResult));
  }
}

module.exports = new WinesController();
