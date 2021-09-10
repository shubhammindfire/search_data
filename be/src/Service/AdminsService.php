<?php

namespace App\Service;

use App\Constants;
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

	// /**
	//  * This function is used to create a dummy admin for the first login when no admin is registered
	//  * otherwise the user will have to manually enter data into the database
	//  * This will not need any authentication
	//  * @return array
	//  */
	// public function createDefaultAdmin(): array
	// {
	// 	try {
	// 		/**
	// 		 * @var Admins $admin
	// 		 */
	// 		$admin = new Admins();
	// 		$admin->setFirstname(Constants::DEFAULT_ADMIN_FIRST_NAME);
	// 		$admin->setLastname(Constants::DEFAULT_ADMIN_LAST_NAME);
	// 		$admin->setEmail(Constants::DEFAULT_ADMIN_EMAIL);
	// 		$admin->setPassword(Constants::DEFAULT_ADMIN_PASSWORD);
	// 		$em = $this->doctrine->getManager();
	// 		$em->persist($admin);
	// 		$em->flush();

	// 		$this->logger->info("Successfully added default admin");
	// 		return ["status" => "Success"];
	// 	} catch (Exception $exception) {
	// 		$this->logger->error("Failed to successfully add default admin. Error: " . $exception->getMessage());
	// 		return ["status" => "Error", "message" => "Error: Failed to add default admin" . $exception->getMessage()];
	// 	}
	// }

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
			$this->logger->error("Failed to successfully delete admin with id=$id. Error: " . $exception->getMessage());
			return ["status" => "Error", "message" => "Error: Failed to delete admin with id=$id"];
		}
	}
}
