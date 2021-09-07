<?php

namespace App\Entity;

use App\Repository\PropertyRecordsRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass=PropertyRecordsRepository::class)
 * @ORM\Table(name="property_records")
 * @ORM\HasLifecycleCallbacks
 * @ApiResource()
 * @ApiFilter(SearchFilter::class, properties={
 *      "section": "exact",
 *      "town": "exact",
 *      "rng": "exact",
 *      "subdivision": "partial"
 * })
 * @ApiFilter(OrderFilter::class, properties={
 *      "section": "ASC",
 *      "town": "ASC",
 *      "rng": "ASC",
 *      "subdivision": "ASC",
 *      "description": "ASC",
 * })
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
     * @ORM\Column(type="string", length=255, nullable=true)
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

    /**
     * @ORM\Column(name="created_at", type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(name="updated_at", type="datetime")
     */
    private $updatedAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function setImage(string $image): self
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt($createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt($updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps(): void
    {
        $currentDateTime = new \DateTime('now');
        $this->setUpdatedAt($currentDateTime);
        if ($this->getCreatedAt() === null) {
            $this->setCreatedAt($currentDateTime);
        }
    }

    public function getImageUrl(): ?String
    {
        if ($this->image === null || $this->image === "")
            return null;
        return 'uploads/' . $this->id . '_' . $this->image;
    }
}
