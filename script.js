"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
  if (!menuToggle || !navMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("open");
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navMenu.classList.toggle("open", !isOpen);
  });
  navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });
}

const serviceTabs = document.querySelectorAll(".service-tab");
const serviceCards = document.querySelectorAll(".service-card");
serviceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const category = tab.dataset.filter;
    serviceTabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
    });
    serviceCards.forEach((card) => { card.hidden = category !== "all" && card.dataset.category !== category; });
  });
});

const bookingForm = document.querySelector("#booking-form");
const bookingSummary = document.querySelector("#booking-summary");
const bookingStatus = document.querySelector("#booking-status");
const bookingDate = document.querySelector("#date");
const bookingService = document.querySelector("#service");
const bookingTime = document.querySelector("#time");
const bookingName = document.querySelector("#name");
const bookingEmail = document.querySelector("#email");

if (bookingDate) {
  const now = new Date();
  bookingDate.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function updateBookingSummary() {
  if (!bookingSummary || !bookingService || !bookingDate || !bookingTime) return;
  const summaryText = bookingSummary.querySelector("p");
  if (!summaryText) return;
  const service = bookingService.value;
  const date = bookingDate.value;
  const time = bookingTime.value;
  if (!service && !date && !time) {
    summaryText.textContent = "Select a service, date and time to see your summary here.";
    return;
  }
  const formattedDate = date
    ? new Date(`${date}T12:00:00`).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : "date to be chosen";
  summaryText.textContent = `${service || "Service to be chosen"} · ${formattedDate} · ${time || "time to be chosen"}`;
}

[bookingService, bookingDate, bookingTime].forEach((field) => {
  if (field) field.addEventListener("change", updateBookingSummary);
});

document.querySelectorAll(".book-service").forEach((button) => {
  button.addEventListener("click", () => {
    if (!bookingForm || !bookingService) return;
    const service = button.dataset.service;
    const option = Array.from(bookingService.options).find((item) => item.textContent.trim() === service);
    if (option) bookingService.value = option.value;
    updateBookingSummary();
    document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => bookingService.focus(), 450);
  });
});

if (bookingForm && bookingStatus) {
  bookingForm.addEventListener("input", () => { bookingStatus.textContent = ""; });
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingStatus.textContent = "";
    if (!bookingForm.reportValidity()) {
      bookingStatus.textContent = "Please check the required fields and try again.";
      return;
    }
    const name = bookingName?.value.trim() || "there";
    const service = bookingService?.value || "your selected service";
    const email = bookingEmail?.value.trim() || "your email address";
    bookingStatus.textContent = `Thanks, ${name}! Your request for ${service} is ready, but this demo hasn't sent or saved it. The team would need to contact you at ${email} after a secure booking service is connected. Your appointment is not confirmed.`;
  });
}

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
if (contactForm && contactStatus) {
  contactForm.addEventListener("input", () => { contactStatus.textContent = ""; });
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactStatus.textContent = "";
    if (!contactForm.reportValidity()) {
      contactStatus.textContent = "Please check the required fields and try again.";
      return;
    }
    contactStatus.textContent = "Thank you for your note! This demo doesn't send or store messages yet. Please add a secure contact service before launch.";
  });
}

const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const updateBackToTop = () => backToTop.classList.toggle("visible", window.scrollY > 500);
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}
