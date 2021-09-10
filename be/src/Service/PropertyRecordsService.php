<?php

namespace App\Service;

use App\Entity\PropertyRecords;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ZipArchive;

class PropertyRecordsService extends BaseService
{
	/**
	 * @var LoggerInterface
	 */
	protected $logger;

	/**
	 * @var ManagerRegistry
	 */
	private $doctrine;

	/**
	 * @var ObjectRepository
	 */
	private $repository;

	function __construct(LoggerInterface $logger, ManagerRegistry $doctrine)
	{
		$this->logger = $logger;
		$this->doctrine = $doctrine;
		$this->repository = $this->doctrine->getRepository(PropertyRecords::class);
	}

	public function truncateTable($tablename)
	{
		/** @var EntityManager $em */
		$em = $this->doctrine->getManager();
		$connection = $em->getConnection();
		$platform = $connection->getDatabasePlatform();
		$truncateSql = $platform->getTruncateTableSQL($tablename);
		$connection->executeStatement($truncateSql);
		$this->logger->info("Table $tablename truncated successfully");
	}

	/**
	 * @param UploadedFile $csvFile
	 * @param UploadedFile $zipFile
	 * @param String $destination
	 * @return array
	 */
	public function importData(UploadedFile $csvFile, UploadedFile $zipFile, String $destination): array
	{
		try {
			$TABLE_NAME = "property_records";
			$ZIP_FOLDER_DESTINATION = "zipFolder";

			$propertyRecordsList = array();

			$isTruncated = false; // to keep track if table has been truncated or not
			$isExtracted = false; // to keep track if the zip has been extracted or not
			$isUploadedRemoved = false; // to keep track if the uploaded folder has been deleted or not
			// read the csv file
			$rowNo = 1;
			if (($fp = fopen($csvFile, "r")) !== FALSE) {
				while (($row = fgetcsv($fp, 1000, ",")) !== FALSE) {
					if ($rowNo === 1) {
						// check that the format of the csv is as expected
						if ($row[0] !== 'image' || $row[1] !== 'section' || $row[2] !== 'town' || $row[3] !== 'range' || $row[4] !== 'subdivision' || $row[5] !== 'description') {
							// if the format of the csv file is incorrect then send error response
							$this->logger->info("Wrong CSV file format");
							return ["status" => "Error", "message" => "Error: Wrong CSV format. Please upload CSV file with data in expected format only."];
						}
					} else {
						$zip = new ZipArchive();
						if ($isExtracted === false) {
							if ($zip->open($zipFile) === TRUE) {
								$zip->extractTo($ZIP_FOLDER_DESTINATION);
								$zip->close();
								$isExtracted = true;
								$this->logger->info("Extracted zip file");
							} else {
								$this->logger->info("Unable to extract zip file");
								return ["status" => "Error", "message" => "Error: Unable to extract zip file"];
							}
						}
						// clear the property_records table
						if ($isTruncated === false) {
							$this->truncateTable($TABLE_NAME);
							$isTruncated = true;
						}
						// clear the uploads directory
						$filesystem = new Filesystem();
						if ($isUploadedRemoved === false) {
							$filesystem->remove($destination);
							$isUploadedRemoved = true;
						}

						$propertyRecord = new PropertyRecords();

						// add data to the new PropertyRecords object
						$propertyRecord->setSection($row[1]);
						$propertyRecord->setTown($row[2]);
						$propertyRecord->setRng($row[3]);
						$propertyRecord->setSubdivision($row[4]);
						$propertyRecord->setDescription($row[5]);

						$em = $this->doctrine->getManager();
						$em->persist($propertyRecord);
						$em->flush();

						// after the PropertyRecord is saved to database copy the images from the zip folder
						if ($row[0] !== null && $row[0] !== "") {
							$newFilename = $propertyRecord->getId() . '_' .  $row[0];

							$filesystem = new Filesystem();
							$filename = $row[0];
							if ($filesystem->exists($ZIP_FOLDER_DESTINATION . '/' .  $filename)) {
								$newFilename = $propertyRecord->getId() . "_" . $filename;
								$filesystem->copy($ZIP_FOLDER_DESTINATION . '/' . $filename, $destination . '/' . $newFilename);

								// if the image is available and saved in the uploads/ directory successfully
								// now save the image name in the database
								$propertyRecord->setImage($filename);
								$em->persist($propertyRecord);
								$em->flush();


								$this->logger->info("Added new file with filename as $newFilename to $destination");
							} else {
								$this->logger->info("No image found with filename as $filename");
							}
						}
						array_push($propertyRecordsList, $propertyRecord);
					}
					$rowNo++;
				}
				fclose($fp);
				// removing the zip folder after the contents are copied to uploads/ directory
				$filesystem->remove($ZIP_FOLDER_DESTINATION);
			}
			$this->logger->info("Successfully imported new PropertyRecord data");
			return ["status" => "Success", "message" => $propertyRecordsList];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully import new PropertyRecord data. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to import new PropertyRecord data"];
		}
	}

	// /**
	//  * @param String $field
	//  * @param String $searchText
	//  * @param String $tablename
	//  */
	// function filterFullText($searchText, $field = "subdivision", $tablename = "property_records")
	// {
	// 	$RAW_QUERY = "SELECT id, image, section, town, rng, subdivision, description FROM $tablename WHERE MATCH($field) AGAINST('${searchText}' IN NATURAL LANGUAGE MODE)";

	// 	$em = $this->doctrine;
	// 	// $statement = $this->entityManager->getConnection()->prepare($RAW_QUERY);
	// 	$statement = $em->getConnection()->prepare($RAW_QUERY);
	// 	$data = $statement->executeQuery();

	// 	$result = [];
	// 	foreach ($data as $key => $value) {
	// 		$result[$key] = $value;
	// 	}
	// 	var_dump($result);

	// 	return $result;
	// }

	/**
	 * @param int $id
	 * @param String $destination
	 */
	function deletePropertyRecordById(int $id, String $destination)
	{
		try {
			/**
			 * @var PropertyRecords $propertyRecord
			 */
			$propertyRecord = $this->repository->findOneBy(['id' => $id]);
			if ($propertyRecord === null) {
				$this->logger->error("Error: No PropertyRecord found with id=$id");
				return ["status" => "Error", "message" => "No PropertyRecord found with id=$id"];
			}

			$filesystem = new Filesystem();
			$filename = $destination . '/' . $propertyRecord->getId() . '_' . $propertyRecord->getImage();
			if ($filesystem->exists($filename)) {
				$filesystem->remove($filename);
				$this->logger->info("Deleted file with filename as $filename");
			} else {
				$this->logger->info("No image found with filename as $filename");
			}

			$em = $this->doctrine->getManager();
			$em->remove($propertyRecord);
			$em->flush();

			$this->logger->info("Successfully deleted PropertyRecord with id=$id");
			return ["status" => "Success"];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully delete PropertyRecod with id=$id. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to delete PropertyRecord with id=$id"];
		}
	}

	/**
	 * @param int $section
	 * @param int $town
	 * @param int $rng
	 * @param String $subdivision
	 * @param String $description
	 * @param UploadedFile $image
	 * @param String $destination
	 * @return array
	 */
	public function editPropertyRecord(int $id, int $section, int $town, int $rng, string $subdivision, string $description, UploadedFile|null $image, string $destination): array
	{
		try {
			/**
			 * @var PropertyRecords $propertyRecord
			 */
			$propertyRecord = $this->repository->findOneBy(['id' => $id]);
			if ($propertyRecord === null) {
				$this->logger->error("Error: No PropertyRecord found with id=$id");
				return ["status" => "Error", "message" => "No PropertyRecord found with id=$id"];
			}

			$em = $this->doctrine->getManager();

			if ($image !== null) {
				$filesystem = new Filesystem();
				$filename = $destination . '/' . $propertyRecord->getId() . '_' . $propertyRecord->getImage();
				if ($filesystem->exists($filename)) {
					$filesystem->remove($filename);
					$this->logger->info("Deleted file with filename as $filename");
				} else {
					$this->logger->info("No image found with filename as $filename");
				}

				$originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
				$newFilename = $propertyRecord->getId() . '_' .  $originalFilename . '.' . $image->guessExtension();
				$image->move(
					$destination,
					$newFilename
				);
				$propertyRecord->setImage($image->getClientOriginalName());
			}
			if ($section !== $propertyRecord->getSection())
				$propertyRecord->setSection($section);
			if ($town !== $propertyRecord->getTown())
				$propertyRecord->setTown($town);
			if ($rng !== $propertyRecord->getRng())
				$propertyRecord->setRng($rng);
			if ($subdivision !== $propertyRecord->getSubdivision())
				$propertyRecord->setSubdivision($subdivision);
			if ($description !== $propertyRecord->getDescription())
				$propertyRecord->setDescription($description);

			$em->persist($propertyRecord);
			$em->flush();

			$this->logger->info("Successfully edited PropertyRecord with id=$id");
			return ["status" => "Success"];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully edit PropertyRecord with id=$id. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to edit PropertyRecord with id=$id"];
		}
	}

	/**
	 * @param int $section
	 * @param int $town
	 * @param int $rng
	 * @param String $subdivision
	 * @param String $description
	 * @param UploadedFile $image
	 * @param String $destination
	 * @return array
	 */
	public function addPropertyRecord(int $section, int $town, int $rng, string $subdivision, string $description, UploadedFile|null $image, string $destination): array
	{
		try {
			$em = $this->doctrine->getManager();
			$propertyRecord = new PropertyRecords();

			if ($image !== null)
				$propertyRecord->setImage($image->getClientOriginalName());
			$propertyRecord->setSection($section);
			$propertyRecord->setTown($town);
			$propertyRecord->setRng($rng);
			$propertyRecord->setSubdivision($subdivision);
			$propertyRecord->setDescription($description);

			$em->persist($propertyRecord);
			$em->flush();

			if ($image !== null) {
				$originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
				$newFilename = $propertyRecord->getId() . '_' .  $originalFilename . '.' . $image->guessExtension();
				$image->move(
					$destination,
					$newFilename
				);
			}

			$this->logger->info("Successfully added PropertyRecord");
			return ["status" => "Success", "id" => $propertyRecord->getId()];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully add PropertyRecord. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to add PropertyRecord"];
		}
	}

	/**
	 * @param int $id
	 * @return array
	 */
	public function getImageUrl(int $id): array
	{
		try {
			/**
			 * @var PropertyRecords $propertyRecord
			 */
			$propertyRecord = $this->repository->findOneBy(['id' => $id]);

			if ($propertyRecord === null)
				return ["status" => "Error", "message" => "No PropertyRecord for given id=$id"];

			$imageUrl = $propertyRecord->getImageUrl();

			if ($imageUrl === null)
				return ["status" => "Error", "message" => "No image found for PropertyRecord id=$id"];

			return ["status" => "Success", "message" => $propertyRecord->getImageUrl()];
		} catch (Exception $exception) {
			$this->logger->error("Failed to find PropteryRecord with id = $id. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to find PropertyRecord with id = $id"];
		}
	}
}
