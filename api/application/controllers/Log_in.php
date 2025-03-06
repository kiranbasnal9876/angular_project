<?php
defined('BASEPATH') or exit('No direct script access allowed');
class Log_in extends CI_Controller
{

  public function __construct()
  {
    parent::__construct();
    $this->load->model('log_inModel');
  }


  function index()
  {
    $_POST = json_decode(file_get_contents('php://input'), true);
    $email = $_POST['email'];
    $password = $_POST['password'];
    $data = $this->log_inModel->loggin_user($email, $password);
    if ($data == []) {
      $this->fx->Responce(400, false, "you can't log In");
      return;
    } else {
      $token = $this->jwt_token->generate_token($data);
      $this->fx->Responce(200, true, $token);
      return;
    }
  }
}
