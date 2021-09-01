<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Admins;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordHashSubscriber implements EventSubscriberInterface
{
	/**
	 * @var UserPasswordHasherInterface
	 */
	private $passwordHasher;

	public function __construct(UserPasswordHasherInterface $passwordHasher)
	{
		$this->passwordHasher = $passwordHasher;
	}

	public static function getSubscribedEvents()
	{
		return [KernelEvents::VIEW => ['hashPassword', EventPriorities::PRE_WRITE]];
	}

	public function hashPassword(ViewEvent $event)
	{
		$admin = $event->getControllerResult();
		$method = $event->getRequest()->getMethod();

		// if controller is not user or not post or patch method then do nothing
		if (!$admin instanceof Admins || (Request::METHOD_POST !== $method && Request::METHOD_PATCH !== $method))
			return;

		// if controller is user and method is post then encode password
		$admin->setPassword($this->passwordHasher->hashPassword($admin, $admin->getPassword()));
	}
}
