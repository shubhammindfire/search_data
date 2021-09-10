<?php

namespace App\Controller;

use App\Service\PropertyRecordsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

/**
 * @Route("/api/property_records")
 */
class PropertyRecordsController extends AbstractController
{
	/**
	 * @Route("/import_data", methods={"POST"})
	 */
	public function importData(Request $request, PropertyRecordsService $propertyRecordsService)
	{
		/** @var UploadedFile $csvFile */
		$csvFile = $request->files->get('csv-file');
		$zipFile = $request->files->get('zip-file');

		$destination = $this->getParameter('kernel.project_dir') . '/public/uploads';

		if ($csvFile === null)
			return $this->json(["Error" => "CSV file not found"], Response::HTTP_BAD_REQUEST);
		if ($zipFile === null)
			return $this->json(["Error" => "ZIP file not found"], Response::HTTP_BAD_REQUEST);

		$response = $propertyRecordsService->importData($csvFile, $zipFile, $destination);

		if ($response["status"] === "Success")
			return $this->json($response['message'], Response::HTTP_CREATED);
		return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	}

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

	// /**
	//  * @Route("", methods={"GET"})
	//  */
	// public function filterFullText(Request $request, PropertyRecordsService $propertyRecordsService)
	// {
	// 	$subdivision = $request->get('subdivision');
	// 	var_dump($subdivision);
	// 	$response = $propertyRecordsService->filterFullText($subdivision, 'subdivision', 'property_records');

	// 	if ($response["status"] === "Success")
	// 		return $this->json($response['message'], Response::HTTP_CREATED);
	// 	return $this->json(["Error" => $response["message"]], Response::HTTP_BAD_REQUEST);
	// }

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
