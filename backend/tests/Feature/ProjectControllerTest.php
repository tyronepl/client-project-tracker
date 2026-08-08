<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that projects can be listed.
     */
    public function test_projects_can_be_listed(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'clientName',
                        'projectName',
                        'description',
                        'status',
                        'priority',
                        'startDate',
                        'dueDate',
                    ],
                ],
            ]);

        $this->assertCount(3, $response->json('data'));
    }

    /**
     * Test that a project can be created.
     */
    public function test_project_can_be_created(): void
    {
        $projectData = [
            'client_name' => 'Test Client',
            'project_name' => 'Test Project',
            'description' => 'Test project description',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-08-08',
            'due_date' => '2026-09-08',
        ];

        $response = $this->postJson(
            '/api/projects',
            $projectData
        );

        $response
            ->assertStatus(201)
            ->assertJsonPath(
                'data.clientName',
                'Test Client'
            )
            ->assertJsonPath(
                'data.projectName',
                'Test Project'
            )
            ->assertJsonPath(
                'data.status',
                'Planning'
            )
            ->assertJsonPath(
                'data.priority',
                'High'
            );

        $this->assertDatabaseHas('projects', [
            'client_name' => 'Test Client',
            'project_name' => 'Test Project',
            'status' => 'Planning',
            'priority' => 'High',
        ]);
    }

    /**
     * Test that project creation validates required fields.
     */
    public function test_project_creation_requires_required_fields(): void
    {
        $response = $this->postJson(
            '/api/projects',
            []
        );

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'client_name',
                'project_name',
                'status',
                'priority',
                'start_date',
                'due_date',
            ]);
    }

    /**
     * Test that a project can be updated.
     */
    public function test_project_can_be_updated(): void
    {
        $project = Project::factory()->create([
            'client_name' => 'Old Client',
            'project_name' => 'Old Project',
            'status' => 'Planning',
            'priority' => 'Low',
        ]);

        $updateData = [
            'client_name' => 'Updated Client',
            'project_name' => 'Updated Project',
            'description' => 'Updated project description',
            'status' => 'In Progress',
            'priority' => 'High',
            'start_date' => '2026-08-10',
            'due_date' => '2026-09-10',
        ];

        $response = $this->putJson(
            "/api/projects/{$project->id}",
            $updateData
        );

        $response
            ->assertStatus(200)
            ->assertJsonPath(
                'data.clientName',
                'Updated Client'
            )
            ->assertJsonPath(
                'data.projectName',
                'Updated Project'
            )
            ->assertJsonPath(
                'data.status',
                'In Progress'
            )
            ->assertJsonPath(
                'data.priority',
                'High'
            );

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'client_name' => 'Updated Client',
            'project_name' => 'Updated Project',
            'status' => 'In Progress',
            'priority' => 'High',
        ]);
    }

    /**
     * Test that a project can be deleted.
     */
    public function test_project_can_be_deleted(): void
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson(
            "/api/projects/{$project->id}"
        );

        $response->assertStatus(204);

        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    /**
     * Test that requesting a missing project returns 404.
     */
    public function test_missing_project_returns_404(): void
    {
        $response = $this->getJson('/api/projects/999999');

        $response->assertStatus(404);
    }
}