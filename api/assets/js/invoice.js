$("#add-more").on("click", function () {
	$(this)
		.parent()
		.siblings(".add-new")
		.find(".clone:first")
		.clone()
		.appendTo(".add-new")
		.find("input[type='text'],input[type='number'],input[type='hidden']")
		.val("");
});

$(document).on("click", ".delete-item", function () {
	if ($(".clone").length > 1) {
		if ($(this).parents(".clone") != "") {
			var div = $(this).parent("div").parent("div");
			div.remove();
			total_amount();
		}
	}
});

// geting current date...........................
function invoice_date() {
	let d = new Date();
	$("#invoice_date2").val(
		`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d
			.getDate()
			.toString()
			.padStart(2, "0")}`
	);
}

invoice_date();

// calculate total amount..................
function total_amount() {
	let Total_amount = 0;
	$(".Amount").each(function () {
		let amount = parseFloat($(this).val()) || 0;
		Total_amount += amount;
	});
	$("#total-amount").val(Total_amount.toFixed(2));
}

// total_amount();
// calculate amount...................
function amount() {
	$(".Item ").on("input", function () {
		var item = $(this).val();

		var price = $(this).parents(".clone").find(".price").val();

		$(this)
			.parents(".clone")
			.find(".Amount")
			.val(item * price);
		total_amount();
	});
}

amount();

// icon changind of sort

$(document).on("click", ".changeIcon", function () {
	let icon = $(this).find("i");

	if ($(".changeIcon").find("i").hasClass("bi-chevron-up")) {
		$(".changeIcon").find("i").removeClass("bi-chevron-up");
		icon.addClass("bi-chevron-up");
	} else if ($(".changeIcon").find("i").hasClass("bi-chevron-down")) {
		$(".changeIcon").find("i").removeClass("bi-chevron-down");
		icon.addClass("bi-chevron-down");
	}

	if (icon.hasClass("")) {
		icon.addClass("bi-chevron-up");
	} else if (icon.hasClass("bi-chevron-up")) {
		icon.removeClass("bi-chevron-up").addClass("bi-chevron-down");
	} else {
		icon.removeClass("bi-chevron-down").addClass("bi-chevron-up");
	}
});

// geting items......................
$(document).on("keyup", ".inputitem", function () {
	var value = $(this).val().trim();
	if (value == "") {
		$(this).parents(".clone").find(".price").val("");
		$(this).parents(".clone").find(".item_id").val("");
		$(this).parents(".clone").find(".Item").val("");
		$(this).parents(".clone").find(".Amount").val("");
		total_amount();
	}

	let items = [];
	$(".item_id").each(function () {
		if (!$(this).val() == "") {
			items.push($(this).val());
		}
	});
	let set_of_items = new Set(items);
	let items_array = [...set_of_items];

	$(".inputitem").autocomplete({
		minLength: 1,

		source: function (request, response) {
			$.ajax({
				url: baseurl + "Invoice_crudOperations/itemAutoComplete",
				data: {
					value: value,
					items_id: items_array,
				},
				type: "post",
				success: function (data) {
					var parsedData = JSON.parse(data);
					var suggestions = parsedData.output.map((item) => ({
						label: item.name,
						value: item.itemName,
						itemPrice: item.itemPrice,
						id: item.id,
					}));

					response(suggestions);
				},
				error: function (xhr, status, error) {
					console.error("AJAX Error:", error);
					response([]);
				},
			});
		},
		select: function (event, ui) {
			$(this).parents(".clone").find(".price").val(ui.item.itemPrice);
			$(this).parents(".clone").find(".item_id").val(ui.item.id);

			$(this).parents(".clone").find(".Item").val(1);
			var quantity = 1;
			// amount();
			var price = $(this).parents(".clone").find(".price").val();
			$(this)
				.parents(".clone")
				.find(".Amount")
				.val(quantity * price);
			// console.log($("..Amount").val());
			total_amount();
		},
	});
});

// geting client detail.............
$(document).on("keyup", ".clients", function () {
	const value = $(this).val();
	if (value == "") {
		$("#inputphone").val("");
		$("#inputemail").val("");
		$("#inputAddress").val("");
		$(".clientId").val("");
	}

	$(".clients").autocomplete({
		minLength: 1,
		source: function (request, response) {
			$.ajax({
				url: baseurl + "Invoice_crudOperations/clientAutocomplete",
				data: {
					name: request.term,
					// action: "getclientdata",
				},
				type: "post",

				success: function (data) {
					var parsedData = JSON.parse(data);
					var suggestions = parsedData.output.map((item) => ({
						label: item.name,
						value: item.name,
						phone: item.phone,
						email: item.email,
						address: item.address,
						clientId: item.id,
					}));

					response(suggestions);
				},
				error: function (xhr, status, error) {
					console.error("AJAX Error:", error);
					response([]);
				},
			});
		},
		select: function (event, ui) {
			$("#inputphone").val(ui.item.phone);
			$("#inputemail").val(ui.item.email);
			$("#inputAddress").val(ui.item.address);
			$(".clientId").val(ui.item.clientId);
		},
	});
});

// generating invoice number
function generateInvoiceNo() {
	$.ajax({
		url: baseurl + "Invoice_crudOperations/invoiceNumber",
		type: "POST",
		success: function (data) {
			data = JSON.parse(data);
			console.log(data);

			data = data.id;

			let invoice_number = "100" + (Number(data) + 2);

			$("#invoice").val(invoice_number);
		},
	});
}




var check=true;
function validate_invoice(){ 
for(let i=0;i<$(".clone").length;i++){
	var currentClone = $(".clone").eq(i);
	if ($("#client_name").val() == ""||currentClone.find(".inputitem").val() == ""|| currentClone.find(".Amount").val()==0){
		
	 Swal.fire({
	 icon: "error",
	  title: "Oops...",
	 text: "all fields are required",
	 });
						
		   check=false;
		}
		else{
		  check=true;
		}
}
	
  }



//insert invoice data

$(document).on("click", ".submit_invoice", function () {
	let formdata = new FormData(form);

	validate_invoice();

	

	if (check) {
		$.ajax({
			url: baseurl + "Invoice_crudOperations/insert_Invoice",
			type: "post",
			data: formdata,
			processData: false,
			contentType: false,
			dataType: "json",
			success: function (data) {
				if (data.status == 200) {
					Swal.fire({
						title: "Success",
						icon: "data inserted successfully",
						draggable: true,
					});
					$(".submit-form").trigger("reset");
					$(" .submit-form input,select").next("span").text("");
					paggination();
					var editBtn = document.querySelector("#nav-home-tab");
					var tab = new bootstrap.Tab(editBtn);
					tab.show();
				} else {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: data.errors.invoice_no,
					});
				}
			},
		});
	}
});























// let num_obj = {
// 	0: "",
// 	1: " one",
// 	2: " two",
// 	3: " three",
// 	4: " four",
// 	5: " five",
// 	6: " six",
// 	7: " seven",
// 	8: " eight",
// 	9: " nine",
// 	10: " ten",
// 	11: " eleven",
// 	12: " twelve",
// 	13: " thirteen",
// 	14: " fourteen",
// 	15: " fifteen",
// 	16: " sixteen",
// 	17: " seventeen",
// 	18: " eighteeen",
// 	19: " nineteeen",
// 	20: " twenty",
// 	30: " thirty",
// 	40: " fourty",
// 	50: " fifty",
// 	60: " sixty",
// 	70: " seventy",
// 	80: " eightty",
// 	90: " ninety",
// };




// function number_word(num) {
// 	if (num in num_obj) {
// 		return num_obj[num];
// 	}
// 	let word = "";

// 	if (num >= 10000000) {
// 		word += number_word(Math.floor(num / 10000000)) + "  crore ";
// 		num = num % 10000000;
// 	}
// 	if (num >= 100000) {
// 		word += number_word(Math.floor(num / 100000)) + "  Lakh ";
// 		num = num % 100000;
// 	}
// 	if (num >= 1000) {
// 		word += number_word(Math.round(num / 1000)) + "  Thousand ";
// 		num = num % 1000;
// 	}
// 	if (num >= 100) {
// 		word += number_word(Math.round(num / 100)) + "  Hundread ";
// 		num = num % 100;
// 	}
// 	if (num > 20) {
// 		word += number_word(Math.round(num / 10) * 10);
// 		if (num % 10 > 0) {
// 			word += num_obj[num % 10];
// 		}
// 	}
// 	return word;
// }

// console.log(number_word(0));
