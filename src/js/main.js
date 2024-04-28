// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import { parse as parseURL } from "tldts";
import copy from "copy-to-clipboard";

const generateRecord = (form) => {
	console.log('alpn', form.getAll("alpn"), form);
	const url = parseURL(form.get("url"));
	const base = `${url.domain}. ${form.get("ttl")}	IN HTTPS ${form.get("priority")} ${url.subdomain || "."}`;
	const alpn = form.get("alpn") ? `alpn=${form.getAll("alpn").join(",")}` : "";
	const ipv4hint = form.get("ipv4hint") ? `ipv4hint=${form.get("ipv4hint")}` : "";
	const ipv6hint = form.get("ipv6hint") ? `ipv6hint=${form.get("ipv6hint")}` : "";

	return `${base} ${alpn} ${ipv4hint} ${ipv6hint}`
		.trim().replace(/\s{2,}/g, " ");
};
const outputFactory = (record, form) => {
	const label = document.createElement("p");
	label.innerHTML = `Created at ${new Date().toLocaleString()} for <u>${form.get("url")}</u>:`;
	label.classList.add("mb-0");

	const code = document.createElement("code");
	code.innerText = record;

	const copyButton = document.createElement("button");
	copyButton.classList.add("btn", "btn-secondary", "float-end");
	copyButton.innerText = "📋";
	copyButton.addEventListener("click", (event) => {
		copy(record);
		copyButton.innerText = "✓";
		setTimeout(() => {
			copyButton.innerText = "📋";
		}, 2000);
	});

	const output = document.createElement("output");
	output.classList.add("alert", "alert-primary", "mb-3");
	output.appendChild(copyButton);
	output.appendChild(label);
	output.appendChild(code);
	return output;
};
const form = document.querySelector("form");
form.querySelector("button[type=submit]").addEventListener("click", (event) => {
	event.preventDefault();
	const formData = new FormData(form);
	const record = generateRecord(formData);
	form.after(outputFactory(record, formData));
	return false;
});

const tooltipTriggerList = [].slice.call(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});
