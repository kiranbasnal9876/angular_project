



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Management Sysytem</title>
  
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/ci_project.css">
    <link rel="stylesheet" href="assets/css/jquery-ui.css">
    <link rel="stylesheet" href="assets/css/bootstrap_icon.css">
</head>
<body>
 
  <div class=" Main-container ">
    <?php
    
$data=json_decode($invoice_details);
$clients=$data->client_details;
$items=$data->item_details;


function num_to_world($num){
    $arr=[0=>'Zero',
1=>" One",
2=>" two",
3=>" three",
4=>" four",
5=>" five",
6=>" six",
7=>" seven",
8=>" eight",
9=>" nine",
10=>" ten",
11=>" eleven",
12=>" twelve",
13=>" thirteen",
14=>" fourteen",
15=>" fifteen",
16=>" sixteen",
17=>" seventeen",
18=>" eighteen",
19=>" nineteen",
20=>" twenty",
30=>" thirty",
40=>" fourty",
50=>" fifty",
60=>" sixty",
70=> " seventy",
80=>" eighty",
90=>" ninty",
];
    // $str=strlen($num);
    $word="";

    
    if(isset($arr[$num])){
     return   $word .= $arr[$num];
  
    }


if($num>=100000){
    
    $word .= $arr[$num/100000] . "  Lakh";
    $num = $num%100000 ; 
}

if($num>=1000){
    
    $word .= $arr[$num/1000] . " thousand";
    $num = $num%1000 ; 
}


if($num>=100){
    
    $word .= $arr[$num/100] . " hundred";
    $num = $num%100 ; 
}

if($num >=10){
    
    
  
    $word .= $arr[floor(($num/10))*10];
    $num = $num%10 ; 
}
if($num<10 && $num>0){
   

    $word .= $arr[$num];

}

return $word;

}






?>

    <style>
        .header {
            text-align: center;
            padding-bottom: 50px;
        }

        .items_table {
            width: 700px;
            margin-top: 20px;
            text-align: center;
            border: 2px solid black;
            border-collapse: collapse;
        }

        .th {
            background-color: gray;
            border: 1px solid black;
        }

        .amount_details {
            margin-left: 500px;
            margin-top: 30px;
        }
       .amount_in_words{
        margin-left: 500px;
       color: black;
       font-weight: 200px;
       font-size: 12px;
       }
        p {
            text-align: center;
        }

        small {
           
            margin: 5px;
        }

        img {
           
            width: 200px;
        }
    </style>
</head>

<body>

    <table>
        <tbody>
            <tr>
                <td colspan="2" class="header">
                    <img src="assets/images/sansoftwares_logo.png"><br>
                    <b>SAN Software Pvt Ltd</b><br>
                    <span>419, 4th Floor, M3M Urbana, Sector 67,</span><br>
                    <span>Gurugram, Haryana 122018</span>
                </td>
            </tr>

            <tr>
                <td style="width: 550px;">
                    <div>
                        <span><b>Customer:</b></span><br>
                        <span>Name:</span><small><?php echo $clients[0]->name; ?></small><br>
                        <span>Email:</span><small><?php echo $clients[0]->email; ?></small><br>
                        <span>Mobile Number:</span><small><?php echo $clients[0]->phone; ?></small><br>
                        <span>Address:</span><small><?php echo $clients[0]->address; ?></small>
                    </div>
                </td>
                <td>
                    <div>
                        <h2>INVOICE</h2>
                        <span>Invoice No:</span><span><?php echo $clients[0]->invoice_no; ?></span><br>
                        <span>Date:</span><small><?php echo $clients[0]->invoice_date?></small>
                    </div>
                </td>
            </tr>

        </tbody>
    </table>

    <table class="items_table">
        <tbody>
            <tr class="th">
                <td>Item</td>
                <td>Price</td>
                <td>Quantity</td>
                <td>SubTotal</td>
            </tr>
            <?php 
foreach($items as $item) {
    echo "<tr>
            <td>{$item->itemName}</td>
            <td>{$item->itemPrice}</td>
            <td>{$item->quantity}</td>
            <td>{$item->amount}</td>
          </tr>";
}
?>


        </tbody>
    </table>

    <div class="amount_details">
        <span><b class="Total-amount">Subtotal amount:</b><small><?php echo $clients[0]->total_amount; ?></small></span><br>
        <span><b class="Total-amount">Total amount:</b><small><?php echo $clients[0]->total_amount; ?></small></span><br>
       
    </div>
    <div class="amount_in_words">

        <span>In worrds:<?php echo num_to_world($clients[0]->total_amount); ?></span>
    </div>

    <p>THANK YOU</p>

   
    </div>
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/jquery/jquery-3.7.1.min.js"></script>
<script src="assets/jquery/jquery-ui-autocomplete.js"></script>
<script src="assets/js/sweet_alert.js"></script>
<script src="assets/js/validation.js"></script>
<script src="assets/js/ajaxcall.js"></script>
<script src="assets/js/invoice.js"></script>
<script src="assets/js/mail_send.js"></script>
</body>
</html>