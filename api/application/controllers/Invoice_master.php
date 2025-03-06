<?php
defined('BASEPATH') or exit('No direct script access allowed');
require_once FCPATH . "/vendor/autoload.php";

class Invoice_master extends CI_Controller
{

   
    private $check_permission;
    public function __construct()
    {
        parent::__construct();
        $this->load->model('invoice_model');
        $this->load->helper('download');
        $this->check_permission = $this->fx->check_user_permission(5);
    }


    function insert_invoice_data()
    {
        if ($this->check_permission[0]['add_records'] == 0) {
            echo "you have not access this page";
            return;
        }

        $this->form_validation->set_rules('invoice_no', 'Invoice No', 'required|is_unique[invoice_master.invoice_no]');
        if (!$this->form_validation->run()) {
            $error = $this->form_validation->error_array();

            echo json_encode(['errors' => $error]);
            return;
        }

        $form_data = $this->input->post();
        echo   $this->invoice_model->insert_data($form_data);
        return;
    }




    function last_invoice_number()
    {

        $result = $this->invoice_model->generate_invoice();
        echo $result;
        return;
    }



    function client_autocomplete()
    {
        $name = $this->input->post();
        echo $this->invoice_model->client_data($name);
        return;
    }



    function item_autoComplete()
    {
        $data = $this->input->post();
        echo $this->invoice_model->item_data($data['value']);
        return;
    }

    function get_invoice_data()
    {

        $data = json_decode(file_get_contents('php://input'), true);
        $paggination_records =  $this->fx->paggination_data($data);
        $responce = $this->invoice_model->records($paggination_records);
        $this->fx->Responce(200, true, $responce);
        return;
    }



    function invoice_pdf()
    {
        if (isset($_GET['id'])) {
            $id = $_GET['id'];

            $data['invoice_details'] = $this->invoice_model->get_invoice_pdfData($id);
        }
        $mr = '3px';
        $mpdf = new \Mpdf\Mpdf();
        $mpdf->showImageErrors = true;
        ob_start();
        $html = $this->load->view('pdf_html', $data, true);
        $mpdf->WriteHTML($html);
        $data = json_decode($data['invoice_details']);
        $clients = $data->client_details;
        $file = 'invoice_files/' . $clients[0]->invoice_no . '.pdf';
        $mpdf->Output($file, 'I');
    }




    function download_pdf()
    {

        $id = json_decode(file_get_contents('php://input'), true);


        $data['invoice_details'] = $this->invoice_model->get_invoice_pdfData($id);

        $mr = '3px';
        $mpdf = new \Mpdf\Mpdf();
        $mpdf->showImageErrors = true;
        ob_start();
        $html = $this->load->view('pdf_html', $data, true);
        $mpdf->WriteHTML($html);

        $data = json_decode($data['invoice_details']);
        $clients = $data->client_details;

        $file = 'invoice_pdf/' . $clients[0]->invoice_no . '.pdf';

        $mpdf->Output($file, 'F');

        echo $clients[0]->invoice_no;
    }




    function update_invoice_data()
    {
        if ($this->check_permission[0]['update_records'] == 0) {
            echo "you have not access this page";
            return;
        }
        $form_data = $this->input->post();

        $responce =  $this->invoice_model->update_data($form_data);

        echo $responce;
        return;
    }




    function delete_invoice_data()
    {

        if ($this->check_permission[0]['delete_records'] == 0) {
            echo "you have not access this page";
            return;
        }
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->invoice_model->delete_data($id);
        echo $responce;
        return;
    }


    function edit_invoice_data()
    {
        $id = json_decode(file_get_contents('php://input'), true);
        $responce = $this->invoice_model->edit_data($id);
        echo  $responce;
        return;
    }

    function get_permission(){
        $responce= $this->invoice_model->permission_details();
        $this->fx->Responce(200,true,$responce);
       }
}
