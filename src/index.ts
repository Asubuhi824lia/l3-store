import "./icons";
import Router from "./router";
import { favService } from "./services/fav.service";
import { cartService } from "./services/cart.service";
import { userService } from "./services/user.service";

new Router();
favService.init();
cartService.init();
userService.init();

setTimeout(() => {
  document.body.classList.add("is__ready");
}, 250);
