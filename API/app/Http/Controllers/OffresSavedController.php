<?php

namespace App\Http\Controllers;

use App\Models\OffresSaved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OffresSavedController extends Controller
{
    public function getOfferedSaved($id){
        $saves = DB::table('offres_saved')
        ->where('offres_saved.candidate_id', Auth::id())
        ->where('offres_saved.annonce_id', $id)
        ->get();
        return response()->json([
            'saves' => $saves,
        ]);
    }
    public function saveOffer(Request $request){
        $offres = new OffresSaved();
        $offres->candidate_id = $request->input('candidat_id');
        $offres->annonce_id = $request->input('id');
        $offres->save();
        return response()->json([
            'message'=> 'Annonce sauvegarder avec succèss'
        ]);
    }
    public function getCandidateSavedOffers(){
        $saves = DB::table('offres_saved')
        ->join('annonces','annonces.id', '=', 'offres_saved.annonce_id')
        ->join('recruiters','recruiters.id', '=', 'annonces.recruiter_id')
        ->select('annonces.id as annonce_id', 'annonces.job_position', 'recruiters.name')
        ->where('offres_saved.candidate_id', Auth::id())
        ->get();
        $saves_check = DB::table('applications')
        ->join('offres_saved','offres_saved.candidate_id', '=', 'applications.candidate_id')
        ->select('applications.candidate_id as candidat', 'offres_saved.annonce_id as annonce')
        ->where('offres_saved.candidate_id', Auth::id())
        ->get();
        return response()->json([
            'saves' => $saves,
            'saves_check' => $saves_check,
        ]);
    }
}
