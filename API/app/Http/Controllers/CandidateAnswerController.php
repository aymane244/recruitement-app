<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\CandidateAnswers;
use App\Models\QuizeCandidates;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CandidateAnswerController extends Controller
{
    public function sendAnswers(Request $request){
        $answers = new CandidateAnswers();
        $answers->candidate_id = $request->input('candidat_id');
        $answers->quize_id = $request->input('quize_id');
        $answers->candidate_answer = $request->input('candidate_answer');
        // $answers->candidate_score = $request->input('candidate_score');
        $answers->candidate_question = $request->input('candidate_question');
        $answers->correct = $request->input('correct');
        $answers->save();
    }
    public function updateQuize(Request $request){
        QuizeCandidates::where('candidate_id', $request->input('candidate_id'))
        ->where('quize_id', $request->input('quize_id'))
        ->update(['test'=> "passed", "score"=>$request->input('candidate_score')]);
        $succed = $request->input('total') * 0.7;
        if($request->input('candidate_score') >= $succed){
            Application::where('candidate_id', $request->input('candidate_id'))
            ->where('annonce_id', $request->input('annonce_id'))
            ->update(['summon'=> "yes"]);
        }else{
            Application::where('candidate_id', $request->input('candidate_id'))
            ->where('annonce_id', $request->input('annonce_id'))
            ->update(['summon'=> "no"]);
        }
    }
    public function getResults($id){
        $candidates = DB::table('quizes')
        ->join('quize_candidates', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->join('candidates', 'candidates.id', '=', 'quize_candidates.candidate_id')
        ->join('questions', 'quizes.id', '=', 'questions.quize_id')
        ->select('candidates.fname', 'candidates.lname', 'quize_candidates.score', DB::raw('count(questions.id) as total'))
        ->where('quize_candidates.quize_id', $id)
        ->groupBy('quize_candidates.id')
        ->get();
        $correction = DB::table('questions')
        ->where('questions.quize_id', $id)
        ->select('questions.question')
        ->count();
        $succed = $correction * 0.7;
        $quizes = DB::table('quizes')
        ->join('candidates_answers', 'quizes.id', '=', 'candidates_answers.quize_id')
        ->join('candidates', 'candidates.id', '=', 'candidates_answers.candidate_id')
        ->join('quize_candidates', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->where('candidates_answers.quize_id', $id)
        ->where('quize_candidates.score','>=', $succed)
        ->get();
        $check_quize = DB::table('quizes')
        ->join('candidates_answers', 'quizes.id', '=', 'candidates_answers.quize_id')
        ->join('candidates', 'candidates.id', '=', 'candidates_answers.candidate_id')
        ->where('candidates_answers.quize_id', $id)
        ->get();
        return response()->json([
            'result'=>$quizes,
            'candidat'=>$candidates,
            'check'=>$check_quize,
        ]);
    }
    public function summonCandidate(Request $request){
        $summons = json_decode($request->input("ids"));
        foreach($summons as $summon){
            DB::table('applications')
            ->where('candidate_id', $summon->candidate_id)
            ->where('annonce_id', $summon->annonce_id)
            ->update([
                'summon' => "yes",
            ]);
        }
        return response()->json([
            'message' => "Invitation d'entretien bien envoyé"
        ]);
    }
}
