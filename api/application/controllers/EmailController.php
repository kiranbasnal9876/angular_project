<?php
defined('BASEPATH') or exit('No direct script access allowed');
class EmailController extends CI_Controller
{
    public function __construct(){
        parent::__construct();
        $this->jwt_token->get_verified_token();
        $this->load->library('email');
      
    }
   

    public function Send_mail()
    {
        
        $mailData = $this->input->post();

 
        $config['protocol'] = 'smtp';
        $config['smtp_host'] = 'smtp.gmail.com';
        $config['smtp_port'] = 587; 
        $config['smtp_user'] = 'dimpalbasnal0@gmail.com';
        $config['smtp_pass'] = 'lehk fctt zjvc ytsf'; 
        $config['smtp_crypto'] = 'tls';  
        $config['charset'] = 'utf-8';
        $config['mailtype'] = 'html';
        $config['newline'] = "\r\n"; 
        
       
        $config['smtp_debug'] = 2; 
        


        $this->email->initialize($config);

        $this->email->from('dimpalbasnal0@gmail.com', $mailData['sender']);
        $this->email->to($mailData['send_to']);
        $this->email->attach('invoice_pdf/'.$mailData['invoice_no'].'.pdf');

        $this->email->subject($mailData['subject']);
        $this->email->message($mailData['content']);

        if($this->email->send()){

            echo json_encode(['status'=>200]);
            return;

        }else{
            echo json_encode(['error'=>$this->email->print_debugger()]);
            return;
        }
    }

   

}
