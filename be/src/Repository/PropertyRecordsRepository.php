<?php

namespace App\Repository;

use App\Entity\PropertyRecords;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PropertyRecords|null find($id, $lockMode = null, $lockVersion = null)
 * @method PropertyRecords|null findOneBy(array $criteria, array $orderBy = null)
 * @method PropertyRecords[]    findAll()
 * @method PropertyRecords[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PropertyRecordsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PropertyRecords::class);
    }

    // /**
    //  * @return PropertyRecords[] Returns an array of PropertyRecords objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PropertyRecords
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
