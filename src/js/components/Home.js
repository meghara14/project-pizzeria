import { templates } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();


  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage(element);

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

  }
  initWidgets() {
    // Inicjowanie karuzeli lub innych pluginów, jeśli to konieczne
    // Na przykład, używając odpowiednich bibliotek do karuzeli
    // np. Slick Carousel lub Swiper
  }
}

export default Home;