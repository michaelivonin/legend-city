const faker = require("faker/locale/ru");

function generateShops() {
  const shops = [];

  for (let i = 0; i <= 9; i++) {
    let title = faker.company.companyName();
    let avatar = faker.image.avatar();
    let rating = faker.finance.amount(1, 5, 1);
    let phrase = faker.company.catchPhrase();
    let cashback = faker.random.arrayElement(["5 - 7","5 - 10","10 - 15","10 - 20"]);
    let isNew = faker.random.boolean();

    shops.push({
      "id": i,
      "title": title,
      "avatar": avatar,
      "rating": rating,
      "phrase": phrase,
      "cashback": cashback,
      "isNew": isNew,
      "isFavorite": false
    });
  }

  return {"shops": shops};
}

module.exports = generateShops;