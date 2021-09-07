<?php

namespace App\Service;

use App\Entity\PropertyRecords;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
				$propertyRecord->setImage($image->getClientOriginalName());

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

			if ($image !== null) {
				$originalFilename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
				$newFilename = $propertyRecord->getId() . '_' .  $originalFilename . '.' . $image->guessExtension();
				$image->move(
					$destination,
					$newFilename
				);
			}

			$this->logger->info("Successfully added PropertyRecord");
			return ["status" => "Success"];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully add PropertyRecord. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to add PropertyRecord"];
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
