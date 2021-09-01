<?php

namespace App\Service;

use App\Entity\Admins;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectRepository;
use Exception;
use Psr\Log\LoggerInterface;

class AdminsService extends BaseService
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
		$this->repository = $this->doctrine->getRepository(Admins::class);
	}

	/**
	 * @param int $id
	 * @return array
	 */
	public function deleteAdminById(int $id): array
	{
		try {
			/**
			 * @var Admins $admin
			 */
			$admin = $this->repository->findOneBy(['id' => $id]);
			if ($admin === null) {
				$this->logger->error("Error: No admin found with id=$id");
				return ["status" => "Error", "message" => "No admin found with id=$id"];
			}
			$em = $this->doctrine->getManager();
			$em->remove($admin);
			$em->flush();

			$this->logger->info("Successfully deleted admin with id=$id");
			return ["status" => "Success"];
		} catch (Exception $exception) {
			$this->logger->error("Failed to successfully delete invoice with id=$id. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to delete admin with id=$id"];
		}
	}
}
