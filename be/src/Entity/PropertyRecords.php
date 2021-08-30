<?php

namespace App\Entity;

use App\Repository\PropertyRecordsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PropertyRecordsRepository::class)
 * @ORM\Table(name="property_records")
 */
class PropertyRecords
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="blob", nullable=true)
     */
    private $image;

    /**
     * @ORM\Column(type="integer")
     */
    private $section;

    /**
     * @ORM\Column(type="integer")
     */
    private $town;

    /**
     * @ORM\Column(type="integer")
     */
    private $rng;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $subdivision;

    /**
     * @ORM\Column(type="string", length=300)
     */
    private $description;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImage($image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getSection(): ?int
    {
        return $this->section;
    }

    public function setSection(int $section): self
    {
        $this->section = $section;

        return $this;
    }

    public function getTown(): ?int
    {
        return $this->town;
    }

    public function setTown(int $town): self
    {
        $this->town = $town;

        return $this;
    }

    public function getRng(): ?int
    {
        return $this->rng;
    }

    public function setRng(int $rng): self
    {
        $this->rng = $rng;

        return $this;
    }

    public function getSubdivision(): ?string
    {
        return $this->subdivision;
    }

    public function setSubdivision(string $subdivision): self
    {
        $this->subdivision = $subdivision;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }
}
