"use strict";

class Shops extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      isLoading: false,
      serverUrl: "http://localhost:3000/shops",
      shops: null,
    };
  }

  componentDidMount() {
    this.setState({isLoading: true});
    fetch(this.state.serverUrl)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoading: false,
          shops: data,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({isLoading: false});
      });
  }

  handleClick(e, key, isFavorite) {
    e.preventDefault();
    const button = e.target.closest("button");
    if (!button) return false;
    button.classList.toggle("like_active");

    const { shops, serverUrl } = this.state;
    Object.assign(shops[key], {isFavorite: !isFavorite});
    this.setState({shops: shops});

    fetch(`${serverUrl}/${key}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({isFavorite: !isFavorite})
    })
      .then(() => console.log("Done"))
      .catch((error) => {
        console.log("error", error);
        this.setState({isLoading: false});
      });
  }

  handleChange(e) {
    let urlWithParams = (e.target.value === "new") ?
      `${this.state.serverUrl}?isNew=true` : (e.target.value === "favorite") ?
        `${this.state.serverUrl}?isFavorite=true` : this.state.serverUrl;

    this.setState({isLoading: true});
    fetch(urlWithParams)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoading: false,
          shops: data,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({isLoading: false});
      });
  }

  render() {
    const { isLoading, shops } = this.state;

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
              {isLoading ?
                "Загрузка..." :
                !shops || shops.map((shop, i) => (
                  <div
                    className="col-xl-4"
                    key={i}
                    style={{display: "flex"}}
                    onClick={(e) => this.handleClick(e, i, shop.isFavorite)}
                  >
                    <a
                      href="shop_full.html"
                      className="shop_item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                      }}
                    >
                      <div
                        className="shop_item__title"
                        style={{flex: "1"}}
                      >
                        <h3 style={{paddingRight: "46px"}}>{shop.title}</h3>
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
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const domContainer = document.querySelector("#shops");
ReactDOM.render(<Shops />, domContainer);