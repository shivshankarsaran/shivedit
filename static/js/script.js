$(function () {
  const fileInput = $("#file-upload");
  const operationSelect = $("#operation");
  const dynamicInputs = $("#dynamic-inputs");
  const previewContainer = $("#preview-container");
  const previewImg = $("#preview-img");
  const uploadMsg = $("#upload-msg");
  const submitBtn = $("#submit-btn");
  const form = $("#edit-form");
  const dropArea = $("#drop-area");

  // Initially hide
  operationSelect.hide();
  submitBtn.hide();
  previewContainer.hide();

  // File select or drop → preview
  function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => {
        previewImg.attr("src", e.target.result);
        previewContainer.show();
        uploadMsg.text("File ready: " + file.name).css("color", "green");
      };
      reader.readAsDataURL(file);
      operationSelect.show();
    } else {
      previewContainer.hide();
      operationSelect.hide().val("");
      dynamicInputs.empty();
      submitBtn.hide();
      uploadMsg.text("Select a valid image file").css("color", "red");
    }
  }

  // Manual select
  fileInput.on("change", e => handleFile(e.target.files[0]));

  // Drag & drop
  dropArea.on("dragover", e => {
    e.preventDefault();
    dropArea.addClass("dragover");
  });
  dropArea.on("dragleave", () => dropArea.removeClass("dragover"));
  dropArea.on("drop", e => {
    e.preventDefault();
    dropArea.removeClass("dragover");
    const file = e.originalEvent.dataTransfer.files[0];
    if (file) {
      fileInput[0].files = e.originalEvent.dataTransfer.files;
      handleFile(file);
    }
  });
  // Click to open file dialog
  dropArea.on("click", () => fileInput.trigger("click"));

  // Operation input fields
  operationSelect.on("change", function () {
    dynamicInputs.empty();
    submitBtn.hide();

    switch ($(this).val()) {
      case "resize":
        dynamicInputs.html(`
          <label>Width (px): <input type="number" name="width" required></label><br>
          <label>Height (px): <input type="number" name="height" required></label>
        `);
        break;
      case "grayscale":
        dynamicInputs.html(`
        `);
        break;
      case "bw":
        dynamicInputs.html(`
        `);
        break;
      case "rgb":
        dynamicInputs.html(`
          <label>Select the channel</label><br>
          <input type="radio" id="r" name="channel" value="RED" required>
          <label for="r">RED</label><br>
          <input type="radio" id="g" name="channel" value="GREEN" required>
          <label for="g">GREEN</label><br>
          <input type="radio" id="b" name="channel" value="BLUE" required>
          <label for="b">BLUE</label>
        `);
        break;
      case "negative":
        dynamicInputs.html(`
        `);
        break;
      case "crop":
        dynamicInputs.html(`
          <label>Initial Width (px): <input type="number" name="width1" required></label><br>
          <label>Final Width (px): <input type="number" name="width2" required></label><br>
          <label>Initial Height (px): <input type="number" name="height1" required></label><br>
          <label>Final Height (px): <input type="number" name="height2" required></label>
        `);
        break;
      case "flip":
        dynamicInputs.html(`
          <label>Select: </label><br>
          <input type="radio" id="h" name="flip" value="horizontal" required>
          <label for="h">Horizontal</label><br>
          <input type="radio" id="v" name="flip" value="vertical" required>
          <label for="v">Vertical</label><br>
          <input type="radio" id="b" name="flip" value="both" required>
          <label for="b">Both</label>
        `);
        break;
      default:
        return;
    }
    submitBtn.show();
  });

  // Prevent submit if no file
  form.on("submit", e => {
    if (!fileInput[0].files.length) {
      e.preventDefault();
      alert("First select an image.");
    }
  });
});

$(document).ready(function () {

  // Menu toggle for mobile
  $('.menu-btn').on('click', function () {
    $('.navbar .menu').toggleClass('active');
    $('.menu-btn i').toggleClass('active');
  });

  // Smooth scroll when clicking nav items (if anchors)
  $('.navbar .menu li a').on('click', function () {
    $('html, body').css('scrollBehavior', 'smooth');
    // Collapse mobile menu after click
    if ($('.navbar .menu').hasClass('active')) {
      $('.navbar .menu').removeClass('active');
      $('.menu-btn i').removeClass('active');
    }
  });

  // Scroll-up button behavior
  $('.scroll-up-btn').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
    $('html, body').css('scrollBehavior', 'auto');
  });
});
document.addEventListener('scroll', function () {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 20) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
$(document).ready(function () {
  // Sticky add/remove class
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 20) {
      $('.navbar').addClass('sticky');
    } else {
      $('.navbar').removeClass('sticky');
    }
  });

  // Mobile menu toggle
  $('.menu-btn').on('click', function () {
    $('.navbar .menu').toggleClass('active');
    $('.menu-btn i').toggleClass('active');
  });

  // close mobile menu on click of a menu item
  $('.navbar .menu li a').on('click', function () {
    if ($('.navbar .menu').hasClass('active')) {
      $('.navbar .menu').removeClass('active');
      $('.menu-btn i').removeClass('active');
    }
  });
});
$(document).ready(function () {
  // Sticky navbar: add .sticky when scrolled down
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 20) {
      $('.navbar').addClass('sticky');
    } else {
      $('.navbar').removeClass('sticky');
    }
  });

  // Mobile menu toggle
  $('.menu-btn.mobile-toggle').on('click', function () {
    $('.navbar .menu').toggleClass('active');
    $(this).find('i').toggleClass('active');
  });

  // Collapse mobile menu when clicking a menu link
  $('.navbar .menu li a').on('click', function () {
    if ($('.navbar .menu').hasClass('active')) {
      $('.navbar .menu').removeClass('active');
      $('.menu-btn.mobile-toggle i').removeClass('active');
    }
  });
});

$(document).ready(function () {
  // Add/remove sticky class on scroll
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 20) {
      $('.navbar').addClass('sticky');
    } else {
      $('.navbar').removeClass('sticky');
    }
  });

  // Mobile menu toggle
  $('.menu-btn.mobile-toggle').on('click', function () {
    $('.menu').toggleClass('active');
    $(this).find('i').toggleClass('active');
  });

  // Close mobile menu after click
  $('.menu li a').on('click', function () {
    if ($('.menu').hasClass('active')) {
      $('.menu').removeClass('active');
      $('.menu-btn.mobile-toggle i').removeClass('active');
    }
  });
});
$(document).ready(function () {
  // Helper elements
  const $nav = $('.navbar');
  const $editSection = $('#edit'); // section containing your form
  let triggerPoint = 50; // fallback

  function calcTrigger() {
    if ($editSection.length) {
      const rectTop = $editSection.offset().top;
      const halfHeight = $editSection.outerHeight() / 10;
      // Trigger when the page has scrolled past half of the edit section
      triggerPoint = Math.round(rectTop + halfHeight);
    } else {
      // fallback threshold if #edit not found
      triggerPoint = 50;
    }
  }

  // Initial calculation
  calcTrigger();

  // Recalculate on resize (debounced)
  let resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calcTrigger, 150);
  });

  // Scroll handler uses the computed triggerPoint
  $(window).on('scroll', function () {
    const scrolled = $(this).scrollTop();

    if (scrolled > triggerPoint) {
      if (!$nav.hasClass('sticky')) {
        $nav.addClass('sticky');
      }
    } else {
      if ($nav.hasClass('sticky')) {
        $nav.removeClass('sticky');
      }
    }

    // existing scroll-up logic (if you have it)
    if (scrolled > 100) {
      $('.scroll-up-btn').addClass('show');
    } else {
      $('.scroll-up-btn').removeClass('show');
    }
  });

  // mobile menu toggling code (keep as before)
  $('.menu-btn.mobile-toggle').on('click', function () {
    $('.menu').toggleClass('active');
    $(this).find('i').toggleClass('active');
  });

  // If you want an initial check (in case page opens already scrolled)
  $(window).trigger('scroll');
});

const texts = ["Shiv Shankar Saran", "Shiv Shankar Saran", "Shiv Shankar Saran"];
  let textIndex = 0;
  let charIndex = 1; // start after first character
  let isDeleting = false;
  let speed = 100;

  const typingDiv = document.querySelector(".typing");

  function typeEffect() {
    const current = texts[textIndex];
    const firstChar = current.charAt(0); // keep first letter fixed
    const rest = current.substring(1);

    if (isDeleting) {
      typingDiv.textContent = firstChar + rest.substring(0, --charIndex);
      speed = 50;
      if (charIndex < 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        charIndex = 0;
      }
    } else {
      typingDiv.textContent = firstChar + rest.substring(0, charIndex++);
      speed = 100;
      if (charIndex > rest.length) {
        isDeleting = true;
        speed = 3500; // pause before deleting
      }
    }
    setTimeout(typeEffect, speed);
  }

  typingDiv.textContent = texts[0].charAt(0); // show first letter immediately
  setTimeout(typeEffect, speed);