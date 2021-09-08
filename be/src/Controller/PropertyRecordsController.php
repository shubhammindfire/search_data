<?php

namespace App\Controller;

use App\Service\PropertyRecordsService;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\File as FileObject;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/property_records")
 */
class PropertyRecordsController extends AbstractController
{

	/**
	 * @Route("/{id}/imageUrl", methods={"GET"})
	 */
	public function getImageUrl(int $id, PropertyRecordsService $propertyRecordsService)
	{
		$response = $propertyRecordsService->getImageUrl($id);

		if ($response["status"] === "Success")
			return $this->json(["imageUrl" => $response['message']], Response::HTTP_OK);
		return $this->json(["Error" => $response["message"]], Response::HTTP_NOT_FOUND);
	}

	/**
	 * @Route("", methods={"POST"})
	 */
	public function addPropertyRecord(Request $request, PropertyRecordsService $propertyRecordsService)
	{
		$section = $request->get('section');
		$town = $request->get('town');
		$rng = $request->get('rng');
		$subdivision = $request->get('subdivision');
		$description = $request->get('description');

		/** @var UploadedFile $image */
		$image = $request->files->get('image');
		$destination = $this->getParameter('kernel.project_dir') . '/public/uploads';

		$response = $propertyRecordsService->addPropertyRecord($section, $town, $rng, $subdivision, $description, $image, $destination);

		if ($response["status"] === "Success")
			return $this->json(['id' => $response['id']], Response::HTTP_CREATED);
		return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	}

	/**
	 * @Route("/{id}", methods={"PATCH"})
	 */
	public function editPropertyRecord(int $id, Request $request, PropertyRecordsService $propertyRecordsService)
	{
		$section = $request->get('section');
		$town = $request->get('town');
		$rng = $request->get('rng');
		$subdivision = $request->get('subdivision');
		$description = $request->get('description');

		/** @var UploadedFile $image */
		$image = $request->files->get('image');
		$destination = $this->getParameter('kernel.project_dir') . '/public/uploads';

		$response = $propertyRecordsService->editPropertyRecord($id, $section, $town, $rng, $subdivision, $description, $image, $destination);

		if ($response["status"] === "Success")
			return $this->json(null, Response::HTTP_CREATED);
		return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	}

	/**
	 * @Route("/{id}", methods={"DELETE"})
	 */
	public function deletePropertyRecordById(int $id, PropertyRecordsService $propertyRecordsService)
	{
		$destination = $this->getParameter('kernel.project_dir') . '/public/uploads';
		$response = $propertyRecordsService->deletePropertyRecordById($id, $destination);

		if ($response["status"] === "Success")
			return $this->json(null, Response::HTTP_NO_CONTENT);
		return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	}
}
