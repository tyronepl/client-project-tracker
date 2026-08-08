<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween(
            'now',
            '+1 year'
        );

        $dueDate = fake()->dateTimeBetween(
            $startDate,
            '+1 year'
        );

        return [
            'client_name' => fake()->company(),
            'project_name' => fake()->catchPhrase(),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement([
                'Planning',
                'In Progress',
                'On Hold',
                'Completed',
            ]),
            'priority' => fake()->randomElement([
                'Low',
                'Medium',
                'High',
            ]),
            'start_date' => $startDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
        ];
    }
}