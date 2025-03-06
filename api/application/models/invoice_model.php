<?php
defined('BASEPATH') or exit('No direct script access allowed');



class invoice_model extends CI_Model
{
  function insert_data($data)
  {

    $invoice_no = $data['invoice_no'];
    $invoice_date = $data['invoice_date'];
    $client_id = $data['client_id'];
    $total_amount = $data['total_amount'];

    $post_data = array('invoice_no' => $invoice_no, 'invoice_date' => $invoice_date, 'client_id' => $client_id, 'total_amount' => $total_amount);

    if ($this->db->insert('invoice_master', $post_data)) {
      $last_id = $this->db->insert_id();
      $item_id = $_POST['item_id'];
      $quantity = $_POST['quantity'];
      $amount = $_POST['amount'];
      $this->fx->create_log( 'insert', json_encode($data), 'Invoice Master', 'invoice_master', $last_id);

      for ($i = 0; $i < count($item_id); $i++) {
        if ($quantity[$i] != "" && $item_id[$i] != "") {
          $items = array('invoice_id' => $last_id, 'item_id' => $item_id[$i], 'quantity' => $quantity[$i], 'amount' => $amount[$i]);
          if ($this->db->insert('invoice_itemlist', $items)) {

            return json_encode(['status' => 200]);
          }
        } else {


          return json_encode(['status' => "select item Quantiy"]);
        }
      }
    }
  }


  function generate_invoice()
  {
    $data = $this->db->select('id')->from('invoice_master')->order_by('id', 'desc')->limit(1)->get()->row();
    echo json_encode($data);
  }

  // client autocomplete
  function client_data($name)
  {
    $this->db->like($name);
    $result = $this->db->get('client_master')->result();

    return json_encode(['output' => $result]);
  }


  // item autocomplete
  function item_data($data)
  {

    $itemName['itemName'] = $data;

    if (isset($data['items_id'])) {

      $arrId = $_POST['items_id'];

      $ids = implode(" ,", $arrId);

      $this->db->where_not_in('id', $ids);
    }

    $this->db->like($itemName);
    $result = $this->db->get('item_master')->result();

    return json_encode(['output' => $result]);
  }


  function records($data)
  {

    $pagination = json_decode($data);
    foreach ($pagination->formdata as $key => $value) {
      $this->db->like($key, $value);
    }
    $this->db->from('invoice_master');
    $this->db->join("client_master cm ", "invoice_master.client_id  =  cm.id");
    $this->db->join("state_master sm ", "sm.state_id=cm.state_id");
    $this->db->join("district_master dm ", "dm.district_id=cm.district_id");
    $this->db->select("invoice_master.id, invoice_master.invoice_no,invoice_date,name,CONCAT_WS(', ', cm.address, cm.pincode,dm.district_name,sm.state_name) AS address,email,phone,total_amount");

    $records = $this->db->order_by($pagination->colname, $pagination->order)->get('', $pagination->limit, $pagination->offset)->result_array();
    $total_rows = $this->db->get('invoice_master')->num_rows();
    $total_page  = ceil($total_rows / $pagination->limit);
    return ['table' => $records, 'page_no' => $pagination->page_no, 'total_page' => $total_page];
  }



  function get_invoice_pdfdata($id)
  {

    $this->db->from("invoice_master");
    $this->db->join("client_master cm", "cm.id=invoice_master.client_id");

    $this->db->join("state_master sm ", "sm.state_id=cm.state_id");
    $this->db->join("district_master dm ", "dm.district_id=cm.district_id");
    $this->db->select(" *,invoice_master.id, invoice_master.invoice_no,invoice_date,name,CONCAT_WS(', ', cm.address, cm.pincode,dm.district_name,sm.state_name) AS address,email,phone,total_amount");
    $data = $this->db->where('invoice_master.id', $id)->get("")->result_array();


    $this->db->from("invoice_itemlist");

    $this->db->join("item_master ims", "ims.id= invoice_itemlist.item_id");
    $items = $this->db->where('invoice_itemlist.invoice_id', $id)->get("")->result();

    return json_encode(['client_details' => $data, 'item_details' => $items]);
  }


  function   edit_data($id)
  {
    $this->db->from('invoice_master');
    $this->db->join("client_master cm", "cm.id=invoice_master.client_id");
    $this->db->join("state_master sm ", "sm.state_id=cm.state_id");
    $this->db->join("district_master dm ", "dm.district_id=cm.district_id");
    $this->db->select(" *,CONCAT_WS(', ', cm.address, cm.pincode,dm.district_name,sm.state_name) AS address,invoice_master.id");
    $data = $this->db->where('invoice_master.id', $id)->get("")->result_array();


    $this->db->from('invoice_master');
    $this->db->join("invoice_itemlist item", "item.invoice_id=invoice_master.id");
    $this->db->join("item_master ims", "ims.id= item.item_id");
    $this->db->select("item_id,itemName,itemPrice,quantity,amount");

    $items = $this->db->where('invoice_master.id', $id)->get("")->result_array();

    if ($data) {
      return json_encode(['data' => $data, 'items' => $items]);
    } else {
      return json_encode(['error' => 'no data found']);
    }
  }



  function delete_data($id)
  {

    $this->db->where('invoice_id', $id);

    if ($this->db->delete("invoice_itemlist")) {
      $this->fx->create_log('delete', "deleted id:$id", 'Invoice Master', 'invoice_master', $id);

      if ($this->db->where('id', $id)->delete("invoice_master")) {

        return json_encode(['status' => 200]);
      } else {

        return json_encode(['status' => 400]);
      }
    }
  }


  function update_data($form_data)
  {

    $invoice_no = $form_data['invoice_no'];
    $invoice_id = $form_data['id'];
    $invoice_date = $form_data['invoice_date'];
    $client_id = $form_data['client_id'];
    $total_amount = $form_data['total_amount'];


    $this->db->where('invoice_no', $invoice_no);
    $this->db->where('invoice_no !=', $invoice_no);
    $check_invoice_no =  $this->db->get('invoice_master')->num_rows();

    if ($check_invoice_no == false) {
      $post_data = array('invoice_no' => $invoice_no, 'invoice_date' => $invoice_date, 'client_id' => $client_id, 'total_amount' => $total_amount);
      $this->db->where('id', $invoice_id);
      if ($this->db->update('invoice_master', $post_data)) {
      $this->fx->create_log( 'update', json_encode($form_data), 'Invoice Master', 'invoice_master', $invoice_id);
      $this->db->where('invoice_id', $invoice_id);
        if ($this->db->delete("invoice_itemlist")) {
          $item_id = $_POST['item_id'];
          $quantity = $_POST['quantity'];
          $amount = $_POST['amount'];
          for ($i = 0; $i < count($item_id); $i++) {
            if ($quantity[$i] != "" && $item_id[$i] != "") {
              $items = array('invoice_id' => $invoice_id, 'item_id' => $item_id[$i], 'quantity' => $quantity[$i], 'amount' => $amount[$i]);
              if ($this->db->insert('invoice_itemlist', $items)) {
                $status = 200;
              }
            }
          }
          return json_encode(['status' => $status]);
        }
      }
    } else {
      return json_encode(['error' => " invoice_no is duplicate"]);
    }
  }

  function permission_details(){
    return   $this->fx->check_user_permission(5);
   }
}
