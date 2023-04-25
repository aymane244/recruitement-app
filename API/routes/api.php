<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CandidateAnswerController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CoverLetterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OffresSavedController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\RecommandationController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\ResumeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Public
Route::get('/jobs-company', [HomeController::class, 'getCompanyJobs']);
Route::get('/jobs', [AnnonceController::class, 'show']);
Route::get('/job-description/{id}', [AnnonceController::class, 'edit']);
Route::post('/send-application', [ApplicationController::class, 'sendApplication']);
Route::post('/save-offre', [OffresSavedController::class, 'saveOffer']);

//Recruiter
Route::post('/add-recruiter', [RecruiterController::class, 'store']);
Route::post('/log-recruiter', [RecruiterController::class, 'login']);
Route::get('/edit-recruiter/{id}', [RecruiterController::class, 'editRecruiter']);
Route::post('/update-recruiter/{id}', [RecruiterController::class, 'updateRecruiter']);
Route::get('loggedRecruiter', [RecruiterController::class, 'getRecruiter'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::get('get-totaloffers', [RecruiterController::class, 'getOffers'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::post('add-annonce', [AnnonceController::class, 'create']);
Route::get('get-metatda', [AnnonceController::class, 'getMetadata']);
Route::get('get-annonces/{id}', [AnnonceController::class, 'editAnnonce']);
Route::delete('delete-certificate/{id}', [AnnonceController::class, 'dropCertificate']);
Route::delete('delete-hardskills/{id}', [AnnonceController::class, 'dropHardskills']);
Route::delete('delete-softskills/{id}', [AnnonceController::class, 'dropSoftskills']);
Route::delete('delete-language/{id}', [AnnonceController::class, 'dropLanguage']);
Route::post('update-annonce/{id}', [AnnonceController::class, 'updateAnnonce']);
Route::delete('delete-annonce/{id}', [AnnonceController::class, 'deleteAnnonce']);
Route::post('add-test', [QuizController::class, 'create']);
Route::get('show-tests', [QuizController::class, 'getQuizes'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::get('edit-test/{id}', [QuizController::class, 'editQuizes']);
Route::post('update-test/{id}', [QuizController::class, 'UpdateQuizes']);
Route::delete('delete-question/{id}', [QuizController::class, 'dropQuestion']);
Route::delete('delete-test/{id}', [QuizController::class, 'deleteTest']);
Route::post('filtrer', [ApplicationController::class, 'filtrage']);
Route::get('get-applications', [ApplicationController::class, 'getRecruiterApplication'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::get('show-applications/{id}', [ApplicationController::class, 'getCandidateApllication'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::get('show-selected/{id}', [ApplicationController::class, 'selectedCandidates'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::post('sendTest', [ApplicationController::class, 'sendCandidateTest']);
Route::post('send-invitation', [ApplicationController::class, 'sendInvitation']);
Route::get('/check-application/{id}', [ApplicationController::class, 'checkApplication'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::post('summon-candidate', [CandidateAnswerController::class, 'summonCandidate']);
Route::get('get-result/{id}', [CandidateAnswerController::class, 'getResults']);
Route::post('recommande', [RecommandationController::class, 'sendRecommandation']);
Route::post('send-Interviewinvitation', [RecommandationController::class, 'sendInterview']);
Route::get('recommanded-candidate', [RecommandationController::class, 'getCandidatesRecommended']);
Route::get('recommended', [RecommandationController::class, 'getRecruiterRecommandation'])->middleware(['auth:sanctum', 'abilities:recruiter']);
Route::get('annonces', [RecommandationController::class, 'getAnnonceInterview'])->middleware(['auth:sanctum', 'abilities:recruiter']);

//Admin
Route::post('register', [AdminController::class, 'register']);
Route::post('login', [AdminController::class, 'login']);
Route::post('update-state', [AdminController::class, 'updateAnnonceState']);
Route::post('add-langugage', [AdminController::class, 'addLanguage']);
Route::get('get-languages', [AdminController::class, 'getLanguages']);
Route::post('add-hardskills', [AdminController::class, 'addHardskills']);
Route::get('get-hardskills', [AdminController::class, 'getHardskills']);
Route::post('add-softskills', [AdminController::class, 'addSoftskills']);
Route::get('get-softskills', [AdminController::class, 'getSoftskills']);
Route::get('get-allUsers', [AdminController::class, 'getAllusers']);
Route::delete('delete-softAdmin/{id}', [AdminController::class, 'deleteSoftMetada']);
Route::delete('delete-langAdmin/{id}', [AdminController::class, 'deleteLangMetada']);
Route::delete('delete-hardAdmin/{id}', [AdminController::class, 'deleteHardMetada']);
Route::get('/edit-admin/{id}', [AdminController::class, 'editAdmin']);
Route::post('/update-admin/{id}', [AdminController::class, 'updateAdmin']);

//Candidate
Route::post('/add-candidate', [CandidateController::class, 'create']);
Route::post('/log-candidate', [CandidateController::class, 'login']);
Route::get('loggedCandidate', [CandidateController::class, 'getCandidate'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('get-profil', [ResumeController::class, 'getProfil'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::post('create-resume', [ResumeController::class, 'createReusme']);
Route::post('create-profil', [ResumeController::class, 'createProfil']);
Route::delete('delete-softskillsCandidate/{id}', [ResumeController::class, 'deleteSoftskills']);
Route::delete('delete-hardkillsCandidate/{id}', [ResumeController::class, 'deleteHardskills']);
Route::delete('delete-languageCandidate/{id}', [ResumeController::class, 'deleteLanguages']);
Route::delete('delete-hobbies/{id}', [ResumeController::class, 'deleteHobbies']);
Route::delete('delete-education/{id}', [ResumeController::class, 'deleteEducation']);
Route::delete('delete-experience/{id}', [ResumeController::class, 'deleteExperience']);
Route::get('get-tests', [QuizController::class, 'getCandidateTest'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('get-test-application/{id}', [QuizController::class, 'getQuestions']);
Route::post('send-answers', [CandidateAnswerController::class, 'sendAnswers']);
Route::post('update-quize', [CandidateAnswerController::class, 'updateQuize']);
Route::get('get-CV/{id}', [CandidateController::class, 'getCV']);
Route::post('create-cover-letter', [CoverLetterController::class, 'coverLetter'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('check-resume', [AnnonceController::class, 'checkResume'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('get-coverletter', [CoverLetterController::class, 'getCoverLetter'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('get-candidate-applications', [ApplicationController::class, 'getCandidateApplication'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('/get-saved-offers/{id}', [OffresSavedController::class, 'getOfferedSaved'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('/get-candidate-offers', [OffresSavedController::class, 'getCandidateSavedOffers'])->middleware(['auth:sanctum', 'abilities:candidate']);
Route::get('/get-totals', [CandidateController::class, 'getAll'])->middleware(['auth:sanctum', 'abilities:candidate']);

//Protected Route
Route::middleware('auth:sanctum')->group(function(){
    Route::post('logout', [AdminController::class, 'logout']);
    Route::get('logged', [AdminController::class, 'getUserLogged']);
    Route::get('get-recruiters', [AdminController::class, 'getRecruiters']);
    Route::get('get-candidates', [AdminController::class, 'getCandidates']);
    Route::get('get-offers', [AdminController::class, 'getOffers']);
    Route::post('logoutRecruiter', [RecruiterController::class, 'recruiterLogout']);
    Route::post('logoutCandidate', [CandidateController::class, 'CandidateLogout']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
