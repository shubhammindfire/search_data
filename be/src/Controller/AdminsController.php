<?php

namespace App\Controller;

use App\Service\AdminsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/admins")
 */
class AdminsController extends AbstractController
{
	/**
	 * @Route("/{id}", methods={"DELETE"})
	 * this method deletes an admin
	 * it also ensures that an admin is not able to delete oneself
	 */
	public function deleteAdminById(int $id, AdminsService $adminsService)
	{
		$currentAdmin = $this->getUser();
		$currentAdminId = $currentAdmin->getId();

		if ($id === $currentAdminId) {
			return $this->json(["Error" => "An admin is not allowed to delete oneself"], Response::HTTP_BAD_REQUEST);
		}

		$response = $adminsService->deleteAdminById($id);
		if ($response["status"] === "Success")
			return $this->json(null, Response::HTTP_NO_CONTENT);
		return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	}
}
