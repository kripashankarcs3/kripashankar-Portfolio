'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
if (testimonialsItem.length && modalContainer && overlay && modalCloseBtn && modalImg && modalTitle && modalText) {
  for (let i = 0; i < testimonialsItem.length; i++) {
    testimonialsItem[i].addEventListener("click", function () {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();
    });
  }

  // add click event to modal close button
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables (portfolio filter)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

if (select && selectValue && filterBtn.length && selectItems.length) {
  select.addEventListener("click", function () { elementToggleFunc(this); });

  // add event in all select items
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (form && formBtn && formInputs.length) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const navLabel = this.textContent.trim().toLowerCase();

    for (let i = 0; i < pages.length; i++) {
      if (navLabel === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// certificates upload + save + render
const certInput = document.querySelector("input[name=\"certificates\"]");
const certUploadBtn = document.querySelector(".certifications-upload .form-btn");
const certList = document.querySelector("[data-certificates-list]");

const CERT_STORAGE_KEY = "portfolio_certificates";

const loadCertificates = function () {
  try {
    const raw = localStorage.getItem(CERT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCertificates = function (items) {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(items));
};

const renderCertificates = function () {
  if (!certList) return;
  const items = loadCertificates();
  certList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "timeline-text";
    empty.textContent = "No certificates uploaded yet.";
    certList.appendChild(empty);
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const li = document.createElement("li");
    li.className = "content-card";

    const name = document.createElement("p");
    name.className = "timeline-text";
    name.textContent = item.name;

    const preview = document.createElement(item.type === "application/pdf" ? "a" : "img");
    if (item.type === "application/pdf") {
      preview.href = item.dataUrl;
      preview.target = "_blank";
      preview.rel = "noopener";
      preview.textContent = "View PDF";
      preview.className = "form-btn";
    } else {
      preview.src = item.dataUrl;
      preview.alt = item.name;
      preview.style.maxWidth = "100%";
      preview.style.borderRadius = "12px";
      preview.style.marginTop = "10px";
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "form-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", function () {
      const next = loadCertificates().filter((_, idx) => idx !== i);
      saveCertificates(next);
      renderCertificates();
    });

    li.appendChild(name);
    li.appendChild(preview);
    li.appendChild(removeBtn);
    certList.appendChild(li);
  }
};

const handleCertFiles = function (files) {
  if (!files || !files.length) return;
  const existing = loadCertificates();
  const readers = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    readers.push(new Promise((resolve) => {
      reader.onload = function (e) {
        resolve({
          name: file.name,
          type: file.type || "application/octet-stream",
          dataUrl: e.target.result
        });
      };
    }));
    reader.readAsDataURL(file);
  }

  Promise.all(readers).then((newItems) => {
    const next = existing.concat(newItems);
    saveCertificates(next);
    renderCertificates();
  });
};

if (certInput && certUploadBtn) {
  certUploadBtn.addEventListener("click", function () {
    certInput.click();
  });

  certInput.addEventListener("change", function () {
    handleCertFiles(this.files);
    this.value = "";
  });
}

renderCertificates();
