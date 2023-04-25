<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Recommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RecommandationController extends Controller
{
    public function sendRecommandation(Request $request){
        $recommandation = new Recommendation();
        $recommandation->comment = $request->input('comments');
        $recommandation->rating = $request->input('rating');
        $recommandation->recruiter_id = $request->input('recruiter_id');
        $recommandation->candidate_id = $request->input('candidat_id');
        $recommandation->save();
        return response()->json([
            'message' => 'Candidat recommandé avec succéss'
        ]);
    }
    public function getRecruiterRecommandation(){
        $recomandations = DB::table('recommendations')
        ->select('candidate_id')
        ->where('recruiter_id', Auth::id())
        ->get();
        return response()->json([
            'recommandation' => $recomandations
        ]);
    }
    public function getCandidatesRecommended(){
        $candidates = DB::table('recommendations')
        ->join('candidates', 'candidates.id', '=', 'recommendations.candidate_id')
        ->join('recruiters', 'recruiters.id', '=', 'recommendations.recruiter_id')
        ->join('resumes', 'resumes.candidate_id', '=', 'candidates.id')
        ->select('candidates.id as candidat', 
            'recruiters.id as recruiter', 
            'recommendations.comment', 
            'recommendations.rating', 
            'candidates.fname',
            'candidates.lname',
            'candidates.email as candidat_email',
            'candidates.phone',
            'resumes.profil',
            'resumes.id as resume',
            'candidates.candidate_city',
            'candidates.photo',
            'recruiters.name',
            'recruiters.email as recruiter_email',
        )
        ->get();
        return response()->json([
            'candidat'=> $candidates,
        ]);
    }
    public function getAnnonceInterview(){
        $annonces = DB::table('annonces')
        ->where('annonces.recruiter_id', Auth::id())
        ->groupBy('annonces.id')
        ->get();
        return response()->json([
            'annonces'=>$annonces,
        ]);
    }
    public function sendInterview(Request $request){
        $application = new Application();
        $application->candidate_id = $request->input('candidat_id');
        $application->annonce_id = $request->input('annonce_id');
        $application->selected = 1;
        $application->summon = "yes";
        $application->date_interview = $request->input('date_interview');
        $application->time_interview = $request->input('time_interview');
        $application->recommanded = "yes";
        $application->save();
        return response()->json([
            'message' => "Invitation d'entretien a été bien envoyé"
        ]);
    }
}
