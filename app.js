const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    cart: [],
    alertMessage: "Item added",
    activeAlert: false,
    cartActive: false
  },
  filters: {
    priceNumber(value) {
      return value.toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: 'BRL'
        }
      );
    }
  },
  methods: {
    getProducts() {
      fetch('./api/produtos.json')
        .then(response => response.json())
        .then(parsed => this.products = parsed);
    },
    getProduct(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(response => response.json())
        .then(parsed => this.product = parsed);
    },
    openModal(id) {
      this.getProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    closeModal(e) {
      if (e.target === e.currentTarget) {
        this.product = false;
      }
    },
    addCartItem() {
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.cart.push({ id, nome, preco });
      this.alert(`${this.product.nome} was added to cart.`);
    },
    removeCartItem(index) {
      this.product.estoque++;
      this.cart.splice(index, 1);
    },
    getFromLocalStorage() {
      const localData = window.sessionStorage.TechnoCart;
      if (localData) {
        this.cart = JSON.parse(localData);
      }
    },
    stockCompare() {
      const items = this.cart.filter(item => item.id === this.product.id);
      this.product.estoque -= items.length;
    },
    alert(message) {
      this.alertMessage = message;
      this.activeAlert = true;

      setTimeout(() => {
        this.activeAlert = false;
      }, 2000);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.getProduct(hash.replace("#", ""));
      }
    },
    closeOnClickOutCart(e) {
      if (e.target === e.currentTarget) {
        this.cartActive = false;
      }
    }
  },
  computed: {
    cartTotal() {
      const total = this.cart.reduce((acc, item) => {
        return acc + item.preco;
      }, 0);

      return total;
    }
  },
  watch: {
    product() {
      document.title = this.product.nome || "Techno";
      const hash = this.product.id || ""
      history.pushState(null, null, `#${hash}`);
      if (this.product) {
        this.stockCompare();
      }
    },
    cart() {
      window.sessionStorage.TechnoCart = JSON.stringify(this.cart);
    }
  },
  created() {
    this.getProducts();
    this.router();
    this.getFromLocalStorage();
  }
});