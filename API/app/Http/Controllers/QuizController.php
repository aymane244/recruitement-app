<?php

namespace App\Http\Controllers;

use App\Models\Questions;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    public function create(Request $request){
        $validator = Validator::make($request->all(),[
            'poste' => 'required',
            'titre' => 'required|string|max:500',
            'timer' => 'required|numeric|max:500',
            'description' => 'required|string|max:30000',
            'question' => 'required|string|max:5000',
            'correct_choix' => 'required|string|max:200',
            'choix_1' => 'required|string|max:200',
            'choix_2' => 'required|string|max:200',
            'choix_3' => 'required|string|max:200',
            'choix_4' => 'required|string|max:200',
        ], ['poste.required' => 'Le champs Poste est obligatoire',
            'titre.required' => 'Le champs Titre est obligatoire',
            'titre.max' => 'Le champs Titre ne doit pas dépasser 500 caractères',
            'timer.required' => 'Le champs Durée est obligatoire',
            'timer.max' => 'Le champs Durée ne doit pas dépasser 500 chiffres',
            'description.required' => 'Le champs Déscript de quiz est obligatoire',
            'description.max' => 'Le champs Déscript de quiz ne doit pas dépasser 30000 caractères',
            'question.required' => 'Le champs Question est obligatoire',
            'question.max' => 'Le champs Question ne doit pas dépasser 5000 caractères',
            'correct_choix.required' => 'Veuillez choisir la réposne correcte',
            'correct_choix.max' => 'Le champs Branche ne doit pas dépasser 200 caractères',
            'choix_1.required' => 'Le champs Choix 1 est obligatoire',
            'choix_1.max' => 'Le champs Choix 1 ne doit pas dépasser 200 caractères',
            'choix_2.required' => 'Le champs Choix 2 est obligatoire',
            'choix_2.max' => 'Le  champs Choix 2 pays ne doit pas dépasser 200 caractères',
            'choix_3.required' => 'Le champs Choix 3 est obligatoire',
            'choix_3.max' => 'Le  champs Choix 3 ne doit pas dépasser 200 caractères',
            'choix_4.required' => 'Le champs Choix 4 est obligatoire',
            'choix_4.max' => 'Le  champs Choix 4 ne doit pas dépasser 200 caractères',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $quiz = new Quiz();
            $quiz->titre = $request->input('titre');
            $quiz->timer = $request->input('timer');
            $quiz->description = $request->input('description');
            $quiz->annonce_id = $request->input('poste');
            $quiz->save();
            $questions = json_decode($request->input('questions'));
            foreach($questions as $question){
                $data = [
                    'question' => $question->question,
                    'correct_choix' => $question->correct_choix,
                    'choix_1' => $question->choix_1,
                    'choix_2' => $question->choix_2,
                    'choix_3' => $question->choix_3,
                    'choix_4' => $question->choix_4,
                    'quize_id' => $quiz->id,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                Questions::insert($data);
            }

            return response()->json([
                "status" => 200,
                "message" => "Votre QCM a été bien enregistrer",
            ]);
        }
    }
    public function getQuizes(){
        $quizes = DB::table('quizes')
        ->join('questions', 'quizes.id', '=', 'questions.quize_id')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->where('recruiter_id', Auth::id())
        ->groupBy('quize_id')->get();
        return response()->json([
            'status' => 'success',
            'quizes' => $quizes,
        ]);
    }
    public function editQuizes($id){
        $quizes = DB::table('quizes')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->select(
            'quizes.id as quize', 
            'quizes.titre', 
            'quizes.description', 
            'quizes.annonce_id', 
            'quizes.timer', 
            'annonces.id as annonce',
            'annonces.job_position',
        )
        ->where('quizes.id', $id)
        ->first();
        $questions = DB::table('questions')
        ->join('quizes', 'quizes.id', '=', 'questions.quize_id')
        ->select(
            'quizes.id as quize', 
            'questions.id as question_id',
            'questions.question',
            'questions.correct_choix',
            'questions.choix_1',
            'questions.choix_2',
            'questions.choix_3',
            'questions.choix_4',
            'questions.quize_id',
        )
        ->where('quizes.id', $id)
        ->get();
        $annonces = DB::table('annonces')
        ->get();
        return response()->json([
            'quizes' => $quizes,
            'questions' => $questions,
            'annonces' => $annonces,
        ]);
    }
    public function getCandidateTest(){
        $candidate_test = DB::table('quizes')
        ->join('quize_candidates', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->join('candidates', 'candidates.id', '=', 'quize_candidates.candidate_id')
        ->where('quize_candidates.candidate_id', Auth::id())
        ->get();
        return response()->json([
            'tests' => $candidate_test,
        ]);
    }
    public function getQuestions($id){
        $questions = DB::table('quizes')
        ->join('questions', 'quizes.id', '=', 'questions.quize_id')
        ->where('quizes.id', $id)
        ->get();
        $questions_count = DB::table('quizes')
        ->join('questions', 'quizes.id', '=', 'questions.quize_id')
        ->where('quizes.id', $id)
        ->count();
        $quiz_name = DB::table('quizes')
        ->groupBy('quizes.id')
        ->find($id);
        return response()->json([
            'questions' => $questions,
            'quiz_name' => $quiz_name,
            'count' => $questions_count,
        ]);
    }
    public function UpdateQuizes(Request $request, $id){
        $quize = Quiz::find($id);
        $quize->titre = $request->input('titre');
        $quize->description = $request->input('description');
        $quize->annonce_id  = $request->input('annonce');
        $quize->timer = $request->input('timer');
        $quize->update();
        $questions = json_decode($request->input('questions'));
        foreach($questions as $value){
            $data = [
                'question' => $value->question,
                'correct_choix' => $value->correct_choix,
                'choix_1' => $value->choix_1,
                'choix_2' => $value->choix_2,
                'choix_3' => $value->choix_3,
                'choix_4' => $value->choix_4,
                'quize_id' => $id,
            ];
            if(isset($value->question_id)){
                $data['id'] = $value->question_id;
            }
            Questions::upsert(
                $data,
                ['id', 'quize_id'], 
                ['question', 'correct_choix', 'choix_1', 'choix_2', 'choix_3', 'choix_4']
            );
        }
        return response()->json([
            "status" => 200,
            "message" => "Votre QCM a été bien mis à jour",
        ]);
    }
    public function dropQuestion($id){
        $questions = Questions::find($id);
        if($questions){
            $deleted_questions = $questions->question;
            DB::table('questions')->delete($id);
            return response()->json([
                'message' => 'La question '.$deleted_questions.' supprimée avec success'
            ]);
        }
    }
    public function deleteTest($id){
        $quiz = Quiz::find($id);
        if($quiz){
            $deleted_quiz = $quiz->titre;
            DB::table('quizes')->delete($id);
            return response()->json([
                'message' => 'La question '.$deleted_quiz.' supprimée avec success'
            ]);
        }
    }     
}
