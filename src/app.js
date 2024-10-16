// Xử lý tải ảnh lên nè
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("product-image");
const imageView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadImage);
let uploadedImage = null; // Lưu tạm hình ảnh
function uploadImage() {
  const file = inputFile.files[0];
  const imgLink = URL.createObjectURL(file); // Hiển thị ảnh tạm thời bằng Blob URL
  imageView.style.backgroundImage = `url(${imgLink})`;
  imageView.textContent = "";
  imageView.style.border = 0;

  // Lưu tạm file ảnh để xử lý sau khi nhấn "Add"
  uploadedImage = file;
}

dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
});
dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  inputFile.files = event.dataTransfer.files;
  uploadImage();
});

const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
// rule validate (những yêu cầu để công nhận là validate)
// name: isRequired, space, special character, min(2), max(50),
//price: isRequired, negative, isNumber(Whole numbers, decimals and fractions)
//quantity: isRequired, negative, isNumber, isInteger
//Media: isRequired
//Description: isRequired, min(5), max(500)
const REG_NAME_SPACE = /^\s|\s{2,}|\s$/;
const REG_NAME_SPECIAL_CHARACTERS =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;
// Price
const REG_NEGATIVE = /^-/;
// const REG_ISNUMBER = /[-]?[0-9]+[,.]?[0-9]*([\/][0-9]+[,.]?[0-9]*)*/;
const REG_ISNUMBER = /^[-]?[0-9]+[,.]?[0-9]*([\/][0-9]+[,.]?[0-9]*)*$/;
// Quantity
const REG_ISINTEGER = /^\d+$/;

//viết hàm nhận vào vlaue kiểm tra value theo điều kiện nếu đúng thì return "", sai thì return "câu chửi"
const isRequired = (value) => (value ? "" : "This field is required!");

const excessSpace = (value) =>
  REG_NAME_SPACE.test(value)
    ? "No extra spaces allowed! Please try again."
    : "";

const specialCharacters = (value) =>
  REG_NAME_SPECIAL_CHARACTERS.test(value)
    ? ""
    : "Special characters are not allowed!";

const min = (numBound) => (value) =>
  value.length >= numBound ? "" : `Minimum ${numBound} characters!`;

const max = (numBound) => (value) =>
  value.length <= numBound ? "" : `Maximum ${numBound} characters!`;

const isNagative = (value) =>
  REG_NEGATIVE.test(value) ? "Negative numbers are not allowed!" : "";

const isNumber = (value) =>
  REG_ISNUMBER.test(value)
    ? ""
    : "Don't use letters and make sure is a number!";

const isInteger = (value) =>
  REG_ISINTEGER.test(value) ? "" : "Only integers are accepted!";

// Test
// console.log(isRequired("")); // This field is required!
// console.log(isRequired("Hello")); // ""
// console.log(excessSpace("Hello  World")); // There is too much space between words!
// console.log(excessSpace("Hello World")); // ""
// console.log(specialCharacters("Hello@World")); // Special characters are not allowed!
// console.log(specialCharacters("Hello World")); // ""
// console.log(min(5)("Hello")); // ""
// console.log(min(5)("Hello World")); // ""
// console.log(max(5)("Hello World")); // Maximum 5 characters!
// console.log(max(5)("Hello")); // ""
// console.log(isNagative("-5")); // Negative numbers are not allowed!
// console.log(isNagative("5")); // ""
// console.log(isNumber("5.5")); // ""
// console.log(isNumber("5,5")); // ""
// console.log(isNumber("5.5.5")); // Don't use digits and make sure the number you enter is a decimal.
// console.log(isInteger("5")); // ""
// console.log(isInteger("5.5"));
// console.log(isInteger("434253452435524"));
// console.log(isInteger("5.5.5"));

//Ta có một object có cấu trúc nhưu sau
/*
{
    value: giá trị trong input(controlNode) cần kiểm tra 
    funcs: mảng các hàm kiểm tra value, hàm phải có dạng (value) => "câu chửi"
    parentNode: cha của input(controlNode), dùng để nhét thêm câu chửi 
    controlNode: mảng các input để mình tô màu đỏ
}
*/

//Hàm hiển thị thông báo lỗi, không áp dụng cho Media
// const createMsg = (parentNode, controlNode, msg) => {
//     //Tạo div chứa câu chửi
//     let invalidDiv = document.createElement("div");
//     invalidDiv.innerHTML = msg;
//     invalidDiv.className = "error-msg";
//     parentNode.appendChild(invalidDiv);
//     //Tô đỏ cho ô input
//     controlNode.forEach((inputNode) => {
//         inputNode.classList.add("error-input");
//     });
// }

//test thử
// let nameNode = document.querySelector("#product-name");
// createMsg(nameNode.parentElement, [nameNode], "CC");

//Hàm hiển thị thông báo lỗi cho Media

// const createMsgImg = (parentNode, controlNode, msg) => {
//     //Tạo div chứa câu chửi
//     let invalidDiv = document.createElement("div");
//     invalidDiv.innerHTML = msg;
//     invalidDiv.className = "error-msg";
//     parentNode.parentElement.appendChild(invalidDiv);
//     //Tô đỏ cho ô input
//     controlNode.forEach((inputNode) => {
//         inputNode.classList.add("error-input-none-img");
//     });
// }

//test thử
// let mediaNode = document.querySelector("#product-image");
// createMsgImg(mediaNode.parentElement, [mediaNode.parentElement], "CC");

//Hàm cải tiến
const createMsg = (parentNode, controlNode, msg, className) => {
  //Tạo div chứa câu chửi
  const invalidDiv = document.createElement("div");
  invalidDiv.innerHTML = msg;
  invalidDiv.className = "error-msg";
  parentNode.appendChild(invalidDiv);
  //Tô đỏ cho ô input
  controlNode.forEach((inputNode) => {
    inputNode.classList.add(className);
  });
};

//Hàm isValid là hàm nhận vào 1object có dạng
// {value, funcs, parentNode, controlNodeS}
//duyệt mảng funcs,đi qua từng func
//và chạy func đó với value
// nếu có hàm nào trả về chuỗi khác rỗng thì gọi hàm createError để hiển thị và đồng thời ngừng luôn return msg
//nếu duyệt hết luôn k bị chửi gì thi return ""

// const isValid = ({value, funcs, parentNode, controlNode}) => {
//     // duyệt danh sách các hàm cần kiểm tra, có vấn đề thì ném ra câu chửi, không thì ném ra chuỗi rỗng
//     for (const funcCheck of funcs) {
//         const msg = funcCheck(value);
//         if(msg){
//             createMsg(parentNode, controlNode, msg);
//             return msg;//ngừng luôn và ném ra câu chửi
//         }
//     }
//     return "";//nếu không bị chửi gì thì trả về rỗng
// }
//test
// const nameNode = document.querySelector("#product-name");
// isValid({
//     value: nameNode.value,
//     funcs: [isRequired, excessSpace, specialCharacters, min(2), max(50)],
//     parentNode: nameNode.parentElement,
//     controlNode: [nameNode],
// })

// const isValidImg = ({value, funcs, parentNode, controlNode}) => {
//     // duyệt danh sách các hàm cần kiểm tra, có vấn đề thì ném ra câu chửi, không thì ném ra chuỗi rỗng
//     for (const funcCheck of funcs) {
//         const msg = funcCheck(value);
//         if(msg){
//             createMsgImg(parentNode, controlNode, msg);
//             return msg;//ngừng luôn và ném ra câu chửi
//         }
//     }
//     return "";//nếu không bị chửi gì thì trả về rỗng
// }
//test
// const mediaNode = document.querySelector("#product-image");
// isValidImg({
//     value: mediaNode.value,
//     funcs: [isRequired],
//     parentNode: mediaNode.parentElement,
//     controlNode: [mediaNode.parentElement],
// })

//Hàm cải tiến
const isValid = ({ value, funcs, parentNode, controlNode }, className) => {
  // duyệt danh sách các hàm cần kiểm tra, có vấn đề thì ném ra câu chửi, không thì ném ra chuỗi rỗng
  for (const funcCheck of funcs) {
    const msg = funcCheck(value);
    if (msg) {
      createMsg(parentNode, controlNode, msg, className);
      return msg; //ngừng luôn và ném ra câu chửi
    }
  }
  return ""; //nếu không bị chửi gì thì trả về rỗng
};

//test cho name
// const nameNode = document.querySelector("#product-name");
// isValid({
//     value: nameNode.value,
//     funcs: [isRequired, excessSpace, specialCharacters, min(2), max(50)],
//     parentNode: nameNode.parentElement,
//     controlNode: [nameNode],
// }, "error-input");

//test cho media
// const mediaNode = document.querySelector("#product-image");
// isValid({
//     value: mediaNode.value,
//     funcs: [isRequired],
//     parentNode: mediaNode.parentElement.parentElement,
//     controlNode: [mediaNode.parentElement],
// }, "error-input-none-img");

//Hàm xóa thông báo lỗi
const clearMsg = () => {
  let errMsg = [
    ...document.querySelectorAll(".error-input"),
    ...document.querySelectorAll(".error-input-none-img"),
    ...document.querySelectorAll(".error-msg"),
  ];

  document.querySelectorAll(".error-input").forEach((inputNode) => {
    inputNode.classList.remove("error-input");
  });
  document.querySelectorAll(".error-input-none-img").forEach((inputNode) => {
    inputNode.classList.remove("error-input-none-img");
  });
  document.querySelectorAll(".error-msg").forEach((item) => {
    item.remove();
  });
  return errMsg.length;
};

//Hàm xóa các trường input
const clearInputField = () => {
  uploadImage = null;
  //Đặt lại biến lưu ảnh
  //content chứa nội dung người dùng đã nhập
  let content = "";
  //dom tới các nút input
  // Tên sản phẩm
  const nameNode = document.querySelector("#product-name");
  content += nameNode.value;
  nameNode.value = "";
  // Giá sản phẩm
  const priceNode = document.querySelector("#product-price");
  content += priceNode.value;
  priceNode.value = "";
  // Số lượng
  const quantityNode = document.querySelector("#product-quantity");
  content += quantityNode.value;
  quantityNode.value = "";
  // Tải ảnh lên
  const mediaNode = document.querySelector("#product-image");
  content += mediaNode.value;
  mediaNode.value = "";
  const imgView = document.querySelector("#img-view");
  imageView.style.backgroundImage = "";
  imageView.style.border = "2px dashed #000000";
  imageView.innerHTML = `
        <img src="./508-icon.png">
        <p>Drag and drop or click here<br> to upload image</p>
        <span>Upload and images from desktop</span>
    `;
  //Mô tả
  const descriptionNode = document.querySelector("#product-description");
  content += descriptionNode.value;
  descriptionNode.value = "";
  selectedProduct = null;
  return content;
};

//nút clear
document.querySelector("#clear-product").addEventListener("click", (event) => {
  if (clearInputField()) {
    createToast("success", "Successfully cleared input fields.");
  } else {
    if (clearMsg()) {
      createToast("success", "Error message cleared successfully!");
    } else {
      createToast("warning", "There's nothing to clear in the input fields!");
    }
  }
  uploadedImage = null; // Xóa ảnh đã tải lên
});

//Toast notifications

const notifications = document.querySelector(".notifications");
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
  },
  error: {
    icon: "fa-circle-xmark",
  },
  warning: {
    icon: "fa-triangle-exclamation",
  },
  info: {
    icon: "fa-circle-info",
  },
};

const removeToast = (toast) => {
  toast.classList.add("hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId);
  setTimeout(() => toast.remove(), 500);
};

const createToast = (state, msg) => {
  const { icon } = toastDetails[state];
  const toast = document.createElement("li");
  toast.className = `toast ${state}`;
  toast.innerHTML = `<div class="column">
                         <i class="fa-solid ${icon}"></i>
                         <span>${msg}</span>
                      </div>
                      <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
  notifications.appendChild(toast);
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};

function getBase64(file, callback) {
  const reader = new FileReader();
  reader.readAsDataURL(file); // Chuyển đổi file thành Base64
  reader.onload = () => callback(reader.result);
  reader.onerror = (error) => console.error("Error: ", error);
}

//Tạo class Product để tạo instance sản phẩm
function Product(name, price, quantity, media, description) {
  this.name = name;
  this.price = price;
  this.quantity = quantity;
  this.media = media;
  this.description = description;
  this.id = new Date().toISOString();
}

//-------------------------------Store--------------------------------
function Store() {} //constructor function Store
//Store này chuyên tạo ra những thằng object chứa method quản lý localstorage
//Muốn lưu new product vào Products thì ta phải lấy ra Products từ localstorage và push new product vào Products rồi lưu lại lên localstorage
//=> cần tạo method getProducts
//getProducts lên localstorage lấy ra danh sách products
Store.prototype.getProducts = function () {
  return JSON.parse(localStorage.getItem("products")) || [];
  //cần chuyển về object vì localStorage lưu ở dạng string, nếu không lấy được hoặc ko có gì thì trả về []
};
//Sau khi lấy full danh sách product thì thêm nó vào cuối danh sách products
Store.prototype.add = function (product) {
  const products = this.getProducts();
  //nhét vào danh sách Proiducts
  products.push(product);
  //lưu lại lên localStorage
  localStorage.setItem("products", JSON.stringify(products));
};

//.getProduct(id): hàm nhận vào id và trả về product có id tương ứng
Store.prototype.getProduct = function (id) {
  const products = this.getProducts();
  return products.find((product) => {
    return product.id === id;
  });
};

//.remove(id): hàm nhận vào id và xóa product có id tương ứng
Store.prototype.remove = function (id) {
  const products = this.getProducts();
  const newProducts = products.filter((product) => {
    return product.id !== id;
  });
  //lưu lại vào localStorage
  localStorage.setItem("products", JSON.stringify(newProducts));
};

Store.prototype.convertBase64ToBlob = async function (base64Data) {
  const base64 = await fetch(base64Data);
  const base64Response = await fetch(`${base64Data}`);
  return await base64Response.blob();
};

//-------------------------------RenderUI------------------------------------
function RenderUI() {} //constructor functionRenderUI
//RenderUI chuyên tạo những thằng object chứa method xử lý ui

//.add(product): thêm product vào giao diện
RenderUI.prototype.add = function ({
  id,
  name,
  price,
  quantity,
  media,
  description,
}) {
  const productItem = document.createElement("div");
  productItem.className = "product-item";
  productItem.innerHTML = `
        <div class="product-image-item">
            <img src="${media}" alt="product-image" data-id="${id}" class="image-dom">
        </div>
        <div class="product-info" data-id="${id}">
            <h3 class="product-name" data-id="${id}">${name}</h3>
            <div class="product-price-item" data-id="${id}">
                <p class="product-price-normal" data-id="${id}">${price}</p>
                <p class="product-price-discount" data-id="${id}">${
    price * 2
  }</p>
            </div>
        </div>
    `;
  //nhét vào productlist
  document.querySelector(".product-list").appendChild(productItem);
  //Xóa các ô nhập
  clearInputField();
};

//.renderAll(): hàm lấy ra tất cả Products từ localStorage hiển thị lên giao diện
RenderUI.prototype.renderAll = function () {
  //lấy ra danh sách Products
  const store = new Store();
  const products = store.getProducts();
  //duyệt qua từng product biến từng product trở thành productItem
  //dồn lại thành một chuỗi siêu dài nhét vào productList
  const htmlContent = products.reduce((total, product) => {
    const { id, name, price, quantity, media, description } = product;
    return (total += `
            <div class="product-item">
                <div class="product-image-item">
                    <img src="${media}" alt="product-image" data-id="${id}" class="image-dom">
                </div>
                <div class="product-info" data-id="${id}">
                    <h3 class="product-name" data-id="${id}">${name}</h3>
                    <div class="product-price-item" data-id="${id}">
                        <p class="product-price-normal" data-id="${id}">${price}</p>
                        <p class="product-price-discount" data-id="${id}">${
      price * 2
    }</p>
                    </div>
                </div>
            </div>
        `);
  }, "");

  document.querySelector(".product-list").innerHTML = htmlContent;
};

//Main flow Add product
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault(); //chặn load lại trang
  clearMsg(); //xóa thông báo
  //dom tới các nút input
  // Tên sản phẩm
  const nameNode = document.querySelector("#product-name");
  // Giá sản phẩm
  const priceNode = document.querySelector("#product-price");
  // Số lượng
  const quantityNode = document.querySelector("#product-quantity");
  // Tải ảnh lên
  const mediaNode = document.querySelector("#product-image");
  //Mô tả
  const descriptionNode = document.querySelector("#product-description");

  const errMsg = [
    //Tên sản phẩm
    isValid(
      {
        value: nameNode.value,
        funcs: [isRequired, excessSpace, specialCharacters, min(2), max(26)],
        parentNode: nameNode.parentElement,
        controlNode: [nameNode],
      },
      "error-input"
    ),
    //Giá sản phẩm
    isValid(
      {
        value: priceNode.value,
        funcs: [isRequired, isNagative, isNumber],
        parentNode: priceNode.parentElement,
        controlNode: [priceNode],
      },
      "error-input"
    ),
    //Số lượng
    isValid(
      {
        value: quantityNode.value,
        funcs: [isRequired, isNagative, isNumber, isInteger],
        parentNode: quantityNode.parentElement,
        controlNode: [quantityNode],
      },
      "error-input"
    ),
    //Tải ảnh lên
    isValid(
      {
        value: uploadImage || mediaNode.value,
        funcs: [isRequired],
        parentNode: mediaNode.parentElement.parentElement,
        controlNode: [mediaNode.parentElement],
      },
      "error-input-none-img"
    ),
    // Mô tả
    isValid(
      {
        value: descriptionNode.value,
        funcs: [isRequired, min(5), max(500)],
        parentNode: descriptionNode.parentElement,
        controlNode: [descriptionNode],
      },
      "error-input"
    ),
  ];
  // console.log(errMsg);
  const isValidForm = errMsg.every((item) => !item);

  if (isValidForm) {
    //cofirm có muốn thêm sản phẩm đã có hay không
    const store = new Store();
    const products = store.getProducts();
    const isExist = products.some((product) => product.name === nameNode.value);
    if (isExist) {
      // Sử dụng DNDAlert để hiển thị thông báo xác nhận xóa sản phẩm
      const Alert = new DNDAlert({
        title: "Product already exists",
        message: `<p style="font-size: 16px;">Are you "?</p>`,
        type: "warning",
        html: true,
        buttons: [
          {
            text: "Yes",
            class: "custom-yes-btn", // Thêm class Bootstrap nếu muốn
            onClick: (bag) => {
              // Thực hiện xóa sản phẩm khỏi localStorage
              let store = new Store();
              store.remove(id);

              // //xóa ui-làm đỡ còn cải thiện
              // let ui = new RenderUI();
              // ui.renderAll();
              selectedProduct[1].target.closest(".product-item").remove();

              // Xóa các trường nhập liệu
              clearInputField();

              createToast("success", `"${name}" deleted successfully`);
              bag.CLOSE_MODAL(); // Đóng modal

              // Reset lại biến lưu sản phẩm
              selectedProduct = null;
            },
          },
          {
            text: "Cancel",
            class: "custom-no-btn",
            onClick: (bag) => {
              bag.CLOSE_MODAL(); // Đóng modal nếu nhấn Cancel
            },
          },
        ],
        closeBackgroundClick: true,
        portalElement: document.querySelector("#modal"),
        portalOverflowHidden: true,
        textAlign: "center",
        onOpen: (bag) => {
          console.log("Modal Opened");
          console.log(bag);
        },
        onClose: (bag) => {
          console.log("Modal Closed");
          console.log(bag.PROPERTIES);
        },
        opacity: 1,
        // autoCloseDuration: 5000,
        draggable: true,
        animationStatus: true,
        closeIcon: true,
        sourceControlWarning: true,
      });
    }

    //xử lý logic khi người dùng thêm lại sản phẩm (selectProduct !== null)
    if (selectedProduct !== null) {
      // Chuyển ảnh sang Base64 và lưu sản phẩm vào localStorage
      //Việc dữ liệu đã qua nhiều bước xử lý, nên bị mất một số thuộc tính định dạng của Blob => ko còn tuowng thích với FileReader
      //=> cần chuyển về Blob mới
      const newBlob = new Blob([uploadImage], { type: uploadImage.type });
      getBase64(newBlob, (base64Data) => {
        // Code xử lý tiếp theo
        const newProduct = new Product(
          nameNode.value,
          priceNode.value,
          quantityNode.value,
          base64Data,
          descriptionNode.value
        );
        // Lưu sản phẩm vào localStorage
        const store = new Store();
        store.add(newProduct);
        // Hiển thị thông báo thành công
        createToast(
          "success",
          `Product "${nameNode.value}" added successfully.`
        );
        // Cập nhật giao diện
        const ui = new RenderUI();
        ui.add(newProduct);

        // Xóa file tạm sau khi lưu
        uploadedImage = null;
      });
    } else {
      //Xử lý logic khi người dùng thêm mới sản phẩm
      //lưu vào localStorage và hiển thị lên ui
      // Chuyển ảnh từ blob sang Base64 và lưu sản phẩm vào localStorage

      getBase64(uploadedImage, (base64Data) => {
        // Code xử lý tiếp theo
        const newProduct = new Product(
          nameNode.value,
          priceNode.value,
          quantityNode.value,
          base64Data,
          descriptionNode.value
        );
        // Lưu sản phẩm vào localStorage
        const store = new Store();
        store.add(newProduct);
        // Hiển thị thông báo thành công
        createToast(
          "success",
          `Product "${nameNode.value}" added successfully.`
        );
        // Cập nhật giao diện
        const ui = new RenderUI();
        ui.add(newProduct);

        // Xóa file tạm sau khi lưu
        uploadedImage = null;
      });
    }
  } else {
    createToast("error", "Invalid information. Please re-enter!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new RenderUI();
  ui.renderAll();
});

let selectedProduct = null; // Biến lưu trữ ID của sản phẩm đã chọn

document
  .querySelector(".product-list")
  .addEventListener("click", async (event) => {
    const classEvent = event.target.classList;
    if (
      classEvent.contains("image-dom") ||
      classEvent.contains("product-info") ||
      classEvent.contains("product-name") ||
      classEvent.contains("product-price-item") ||
      classEvent.contains("product-price-normal") ||
      classEvent.contains("product-price-discount")
    ) {
      //laays id cuả product cần phải xóa
      const idRemove = event.target.dataset.id;
      //lấy ra sinh viên muốn xóa
      const store = new Store();
      const product = store.getProduct(idRemove);
      const { id, name, price, quantity, media, description } = product;
      selectedProduct = [product, event]; // lưu sản phẩm đã chọn, event vào biến
      //hiển thị lên form
      const nameNode = document.querySelector("#product-name");
      nameNode.value = name;
      // Giá sản phẩm
      const priceNode = document.querySelector("#product-price");
      priceNode.value = price;
      // Số lượng
      const quantityNode = document.querySelector("#product-quantity");
      quantityNode.value = quantity;
      // Tải ảnh lên
      const imageView = document.querySelector("#img-view"); // Phần hiển thị ảnh đã tải lên
      // Nếu có ảnh, hiển thị ảnh từ Base64
      imageView.style.backgroundImage = `url(${media})`;
      imageView.textContent = "";
      imageView.style.border = 0;

      //promise
      uploadImage = await store.convertBase64ToBlob(media); //

      //Mô tả
      const descriptionNode = document.querySelector("#product-description");
      descriptionNode.value = description;
      //hiển thị thông báo đã chọn thành công
      createToast("info", `Selected "${name}" successfully`);
    }
  });

// Nút delete
document.querySelector("#delete-product").addEventListener("click", (event) => {
  if (selectedProduct !== null) {
    const { id, name, price, quantity, media, description } =
      selectedProduct[0];
    // Sử dụng DNDAlert để hiển thị thông báo xác nhận xóa sản phẩm
    const Alert = new DNDAlert({
      title: "Delete Product",
      message: `<p style="font-size: 16px;">Are you sure to delete product "${name}"?</p>`,
      type: "warning",
      html: true,
      buttons: [
        {
          text: "Yes",
          class: "custom-yes-btn", // Thêm class Bootstrap nếu muốn
          onClick: (bag) => {
            // Thực hiện xóa sản phẩm khỏi localStorage
            let store = new Store();
            store.remove(id);

            // //xóa ui-làm đỡ còn cải thiện
            // let ui = new RenderUI();
            // ui.renderAll();
            selectedProduct[1].target.closest(".product-item").remove();

            // Xóa các trường nhập liệu
            clearInputField();

            createToast("success", `"${name}" deleted successfully`);
            bag.CLOSE_MODAL(); // Đóng modal

            // Reset lại biến lưu sản phẩm
            selectedProduct = null;
          },
        },
        {
          text: "Cancel",
          class: "custom-no-btn",
          onClick: (bag) => {
            bag.CLOSE_MODAL(); // Đóng modal nếu nhấn Cancel
          },
        },
      ],
      closeBackgroundClick: true,
      portalElement: document.querySelector("#modal"),
      portalOverflowHidden: true,
      textAlign: "center",
      onOpen: (bag) => {
        console.log("Modal Opened");
        console.log(bag);
      },
      onClose: (bag) => {
        console.log("Modal Closed");
        console.log(bag.PROPERTIES);
      },
      opacity: 1,
      // autoCloseDuration: 5000,
      draggable: true,
      animationStatus: true,
      closeIcon: true,
      sourceControlWarning: true,
    });
  } else {
    createToast("warning", "Please select the product you want to delete");
    selectedProduct = null;
  }
});

//Remove All
document
  .querySelector("#remove-all-product")
  .addEventListener("click", (event) => {
    //Kiểm tra xem có sản phẩm nào để xóa hay không
    let store = new Store();
    let products = store.getProducts();
    if (products.length === 0) {
      createToast("warning", "There are currently no products to delete!");
    } else {
      const Alert = new DNDAlert({
        title: "Delete All Product",
        message: `<p style="font-size: 16px;">Are you sure to delete all products ?</p>`,
        type: "warning",
        html: true,
        buttons: [
          {
            text: "Yes",
            class: "custom-yes-btn", // Thêm class Bootstrap nếu muốn
            onClick: (bag) => {
              // Thực hiện xóa
              document.querySelector(".product-list").innerHTML = "";
              localStorage.removeItem("products");

              // Xóa các trường nhập liệu
              clearInputField();

              createToast("success", `Deleted all products successfully`);
              bag.CLOSE_MODAL(); // Đóng modal

              // Reset lại biến lưu sản phẩm
              selectedProduct = null;
            },
          },
          {
            text: "Cancel",
            class: "custom-no-btn",
            onClick: (bag) => {
              bag.CLOSE_MODAL(); // Đóng modal nếu nhấn Cancel
            },
          },
        ],
        closeBackgroundClick: true,
        portalElement: document.querySelector("#modal"),
        portalOverflowHidden: true,
        textAlign: "center",
        onOpen: (bag) => {
          console.log("Modal Opened");
          console.log(bag);
        },
        onClose: (bag) => {
          console.log("Modal Closed");
          console.log(bag.PROPERTIES);
        },
        opacity: 1,
        // autoCloseDuration: 5000,
        draggable: true,
        animationStatus: true,
        closeIcon: true,
        sourceControlWarning: true,
      });
    }
  });
