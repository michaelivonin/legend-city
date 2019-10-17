"use strict";

const SERVER_URL = "http://localhost:3000/shops";

class Shops extends React.Component {
  constructor(props) {
    super(props);
    this.getShops = this.getShops.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isLoading: false,
      shops: null,
      error: null,
    };
  }

  getShops(url) {
    this.setState({isLoading: true});

    fetch(url)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoading: false,
          shops: data,
        });
      })
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.getShops(SERVER_URL);
  }

  handleClick(e, key, isFavorite) {
    e.preventDefault();
    const shops = this.state.shops;

    shops.find(shop => shop.id === key).isFavorite = !isFavorite;
    this.setState({shops: shops});

    fetch(`${SERVER_URL}/${key}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({isFavorite: !isFavorite})
    })
      .then(() => console.log("Done"))
      .catch(error => {
        this.setState({
          error,
          isLoading: false,
        });
        console.log("error", error);
      });
  }

  handleChange(e) {
    let urlWithParams = (e.target.value === "new") ? `${SERVER_URL}?isNew=true` :
      (e.target.value === "favorite") ? `${SERVER_URL}?isFavorite=true` : SERVER_URL;

    this.getShops(urlWithParams);
  }

  render() {
    const { isLoading, shops, error } = this.state;

    return (
      <div className="shops__wrapper">
        <div className="content_bar">
          <div className="content_bar__title">
            <h2>Заведения</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Library</li>
              </ol>
            </nav>
          </div>
          <div className="content_bar__sorting">
            Сортировка:
            <select onChange={this.handleChange}>
              <option value="no">Нет</option>
              <option value="favorite">Избранное</option>
              <option value="new">Новое</option>
            </select>
          </div>
        </div>
        <div className="shop">
          <div className="container_fluid">
            <div className="row">
              {error ? error.message :
                isLoading ? "Загрузка..." :
                !shops || shops.map((shop) => (
                  <div
                    className="col-xl-4 shop_item-wrapper"
                    key={shop.id}
                    onClick={(e) => this.handleClick(e, shop.id, shop.isFavorite)}
                  >
                    <a href="shop_full.html" className="shop_item">
                      <div className="shop_item__title">
                        <h3>{shop.title}</h3>
                        <div className="shop_item__title___right">
                          <button className={shop.isFavorite ? "like like_active" : "like"}>
                            <i className="fas fa-heart"></i>
                          </button>
                        </div>
                      </div>
                      <div className="shop_item__center">
                        <div className="shop_item__center___avatar">
                          <div className="shop_avatar">
                            <img src={shop.avatar}/>
                            <span>{shop.rating}</span>
                          </div>
                        </div>
                        <div className="shop_item__center___text">
                          <p>{shop.phrase}</p>
                        </div>
                      </div>
                      <div className="shop_item__bonus">
                        <h3>{shop.cashback}<small>%</small></h3>
                        <span>Бонусов</span>
                      </div>
                    </a>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#shops");
ReactDOM.render(<Shops />, domContainer);