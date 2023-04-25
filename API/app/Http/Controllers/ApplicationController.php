<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\MatchedExperiences;
use App\Models\MatchedHardSkills;
use App\Models\MatchedLanguages;
use App\Models\MatchedSoftSkills;
use App\Models\QuizeCandidates;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicationController extends Controller
{
    function sendApplication(Request $request){
        $application = new Application();
        $application->candidate_id = $request->input('candidate');
        $application->annonce_id = $request->input('annonce');
        $application->save();
        return response()->json([
            "status" => 200,
            "message" => 'Votre candidature a été bien envoyé',
        ]);
    }
    function checkApplication($id){
        $applications = DB::table('applications')
            ->where('candidate_id', Auth::id())
            ->where('annonce_id', $id)
            ->get();
        return response()->json([
            "status" => 200,
            "applications" => $applications,
        ]);
    }
    function getCandidateApllication($id){
        $candidate = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('resumes', 'applications.candidate_id', '=', 'resumes.candidate_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('annonces.id', $id)
        ->where('applications.selected', 0)
        ->get();
        $selected_candidate = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('applications.selected', 1)
        ->where('annonces.id', $id)
        ->groupBy('applications.filtring_type')
        ->get();
        $candidate_id = DB::table('applications')
        ->where('applications.annonce_id', $id)
        ->select("applications.candidate_id as cad_id")
        ->get();
        $application_name = DB::table('annonces')
        ->select('annonces.job_position')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('annonces.id', $id)
        ->groupBy('annonces.id')
        ->find($id);
        $candidate_softskills = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('soft_skills', 'soft_skills.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->distinct()
        ->groupBy('soft_skills.id') 
        ->get();
        $candidate_hardskills = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('hard_skills', 'hard_skills.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->distinct()
        ->groupBy('hard_skills.id') 
        ->get();
        $candidate_languages = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('languages', 'languages.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->distinct()
        ->groupBy('languages.id') 
        ->get();
        $candidate_experience = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('experiences', 'experiences.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->distinct()
        ->groupBy('experiences.id') 
        ->get();
        $candidate_years = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('experiences_years', 'experiences_years.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->distinct()
        ->groupBy('experiences_years.id') 
        ->get();
        $quize = DB::table('quize_candidates')
        ->join('quizes', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('quizes.annonce_id', $id)
        ->get();
        $quize_passed = DB::table('quize_candidates')
        ->join('quizes', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('quizes.annonce_id', $id)
        ->get();
        return response()->json([
            "status" => 200,
            "sofskills" => $candidate_softskills,
            "hardskills" => $candidate_hardskills,
            "language" => $candidate_languages,
            "experience" => $candidate_experience,
            "candidate" => $candidate,
            "app_name" =>$application_name,
            "id" =>$candidate_id,
            "selected" =>$selected_candidate,
            "quiz" =>$quize,
            "passed" =>$quize_passed,
            "years" =>$candidate_years,
        ]);
    }
    public function checkQuiz(){
        
    }
    function filtrage(Request $request){
        $input_filter = $request->input('filter');
        $candidat_id = json_decode($request->input('candidat_id'));
        $annonce_id = $request->input('id');
        foreach($candidat_id as $candidate){
            $experience_annonce = DB::table('annonces')
            ->select('annonces.experience')
            ->where('annonces.id', $annonce_id)
            ->get();
            $experience_candidat = DB::table('experiences_years')
            ->select('experiences_years.years')
            ->where('experiences_years.candidate_id', $candidate->cad_id)
            ->get()
            ->toArray();
            $hardskills_annonce = DB::table('hard_skills')
            ->select('hard_skills.hardskills')
            ->where('hard_skills.annonce_id', $annonce_id)
            ->get()
            ->toArray();
            $hardskills_candidat = DB::table('hard_skills')
            ->select('hard_skills.hardskills')
            ->where('hard_skills.candidate_id', $candidate->cad_id)
            ->get()
            ->toArray();
            $langauge_annonce = DB::table('languages')
            ->select('languages.language', 'languages.read', 'languages.written', 'languages.spoken')
            ->where('languages.annonce_id', $annonce_id)
            ->get()
            ->toArray();
            $langauge_candidat = DB::table('languages')
            ->select('languages.language', 'languages.read', 'languages.written', 'languages.spoken')
            ->where('languages.candidate_id', $candidate->cad_id)
            ->get()
            ->toArray();
            $sofstkills_annonce = DB::table('soft_skills')
            ->select('soft_skills.softskills')
            ->where('soft_skills.annonce_id', $annonce_id)
            ->get()
            ->toArray();
            $softskills_candidat = DB::table('soft_skills')
            ->select('soft_skills.softskills')
            ->where('soft_skills.candidate_id', $candidate->cad_id)
            ->get()
            ->toArray();
            // hard skills
            $array_annonce_hardskills = array_column($hardskills_annonce, 'hardskills');
            $array_candidat_hardskills = array_column($hardskills_candidat, 'hardskills');
            $result_hardskills = array_intersect($array_annonce_hardskills, $array_candidat_hardskills);
            $result_hardskills_diff = array_diff($array_annonce_hardskills, $array_candidat_hardskills);
            $count_hardskills = count($array_annonce_hardskills)/2;
            $hardtable = DB::table('matched_hardskills')
            ->where('annonce_id', $annonce_id)
            ->get();
            // langauge
            $array_annonce_langauge = array_column($langauge_annonce, 'language');
            $array_candidat_langauge = array_column($langauge_candidat, 'language');
            $result_langauge = array_intersect($array_annonce_langauge, $array_candidat_langauge);
            $result_language_diff = array_diff($array_annonce_langauge, $array_candidat_langauge);
            $count_langauge = count($array_annonce_langauge)/2;
            $langtable = DB::table('matched_languages')
            ->where('annonce_id', $annonce_id)
            ->get();
            // softskills
            $array_annonce_softskills = array_column($sofstkills_annonce, 'softskills');
            $array_candidat_softskills = array_column($softskills_candidat, 'softskills');
            $result_softskills = array_intersect($array_annonce_softskills, $array_candidat_softskills);
            $result_softskills_diff = array_diff($array_annonce_softskills, $array_candidat_softskills);
            $count_softskills = count($array_annonce_softskills)/2;
            $softtable = DB::table('matched_softskills')
            ->where('annonce_id', $annonce_id)
            ->get();
            //experience
            $values = json_decode(json_encode($experience_candidat), true);
            $soft = array_values($result_softskills);
            $hard = array_values($result_hardskills);
            $lang = array_values($result_langauge);
            $exptable = DB::table('matched_experiences')
            ->where('annonce_id', $annonce_id)
            ->get();
            if($input_filter === "all"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach($experience_annonce as $exp){
                    foreach($experience_candidat as $cand){
                        foreach ($result_langauge as $language) {
                            $languageData1 = array_filter(json_decode(json_encode($langauge_annonce), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            $languageData2 = array_filter(json_decode(json_encode($langauge_candidat), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            foreach($languageData2 as $val_candidate){
                                foreach($languageData1 as $val_annonce){
                                    if((($exp->experience === "Debutant" && $cand->years >= 0) && 
                                        (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'all',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if((($exp->experience === "Expert" && $cand->years >= 5) && 
                                        (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) && 
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'all',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if((($exp->experience === "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'all',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'all',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if(($exp->experience == "Debutant" && $cand->years >= 0) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills) && 
                                        (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                    }else if(($exp->experience == "Expert" && $cand->years >= 5) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills) && 
                                        (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                    }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills) && 
                                        (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'all',
                                        ]);
                                    }else{
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 0,
                                            'filtring_type' => '',
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage complet'
                // ]);
            }
            if($input_filter === "expereince"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach ($result_langauge as $language) {
                    $languageData1 = array_filter(json_decode(json_encode($langauge_annonce), true), function ($item) use ($language) {
                        return $item['language'] == $language;
                    });
                    $languageData2 = array_filter(json_decode(json_encode($langauge_candidat), true), function ($item) use ($language) {
                        return $item['language'] == $language;
                    });
                    foreach($languageData2 as $val_candidate){
                        foreach($languageData1 as $val_annonce){
                            if(((count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) &&
                                (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                ($val_annonce['language'] === $val_candidate['language']))))
                            {
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 1,
                                    'filtring_type' => 'no_experience',
                                ]);
                                foreach($soft as $val){
                                    $data_softskills = [
                                        'matched_softskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_experience',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedSoftSkills::insert($data_softskills);
                                }
                                $data_language = [
                                    'matched_language' => $language,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'read' => $val_candidate['read'],
                                    'written' => $val_candidate['written'],
                                    'spoken' => $val_candidate['spoken'],
                                    'filtring_type' => 'no_experience',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedLanguages::insert($data_language);
                                foreach($hard as $val){
                                    $data_hardskills = [
                                        'matched_hardskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_experience',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedHardSkills::insert($data_hardskills);
                                }
                            }else if((count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills) && 
                                (count($result_softskills) >= $count_softskills))
                            {
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 1,
                                    'filtring_type' => 'no_experience',
                                ]);
                            }else{
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 0,
                                    'filtring_type' => '',
                                ]);
                            }
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour filtrage sans compter les expériences des candidats'
                // ]);
            }
            if($input_filter === "softskills"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach($experience_annonce as $exp){
                    foreach($experience_candidat as $cand){
                        foreach ($result_langauge as $language) {
                            $languageData1 = array_filter(json_decode(json_encode($langauge_annonce), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            $languageData2 = array_filter(json_decode(json_encode($langauge_candidat), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            foreach($languageData2 as $val_candidate){
                                foreach($languageData1 as $val_annonce){
                                    if(($exp->experience === "Debutant" && $cand->years >= 0) && 
                                        (count($result_hardskills) >= $count_hardskills) && 
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language'])))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                        if(count($result_langauge) >= $count_langauge){
                                            DB::table('applications')
                                            ->where('candidate_id', $candidate->cad_id)
                                            ->where('annonce_id', $annonce_id)
                                            ->update([
                                                'selected' => 1,
                                                'filtring_type' => 'no_softskill',
                                        ]);
                                        }
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_softskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if(($exp->experience == "Expert" && $cand->years >= 5) && 
                                        (count($result_hardskills) >= $count_hardskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_softskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_hardskills) >= $count_hardskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);                            
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_softskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($hard as $val){
                                            $data_hardskills = [
                                                'matched_hardskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_softskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedHardSkills::insert($data_hardskills);
                                        }
                                    }else if(($exp->experience == "Debutant" && $cand->years >= 0) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                    }else if(($exp->experience == "Expert" && $cand->years >= 5) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                    }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_hardskills) >= $count_hardskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_softskill',
                                        ]);
                                    }else{
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 0,
                                            'filtring_type' => '',
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage sans les compétences personnelles des candidats'
                // ]);
            }
            if($input_filter === "hardskills"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach($experience_annonce as $exp){
                    foreach($experience_candidat as $cand){
                        foreach ($result_langauge as $language) {
                            $languageData1 = array_filter(json_decode(json_encode($langauge_annonce), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            $languageData2 = array_filter(json_decode(json_encode($langauge_candidat), true), function ($item) use ($language) {
                                return $item['language'] == $language;
                            });
                            foreach($languageData2 as $val_candidate){
                                foreach($languageData1 as $val_annonce){
                                    if((($exp->experience === "Debutant" && $cand->years >= 0) && 
                                        (count($result_softskills) >= $count_softskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_hardskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                    }else if((($exp->experience === "Expert" && $cand->years >= 5) && 
                                        (count($result_softskills) >= $count_softskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_hardskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                    }else if((($exp->experience === "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_softskills) >= $count_softskills) &&
                                        (($val_annonce['read'] === $val_candidate['read']) || ($val_annonce['read'] === "Debutant" && 
                                        ($val_candidate['read'] === 'Avance') || $val_candidate['read'] === 'Intermediaire') || 
                                        ($val_annonce['read'] === "Intermediaire" && $val_candidate['read'] === 'Avance'))
                                        && (($val_annonce['written'] === $val_candidate['written']) || ($val_annonce['written'] === "Debutant" && 
                                        ($val_candidate['written'] === 'Avance') || $val_candidate['written'] === 'Intermediaire') || 
                                        ($val_annonce['written'] === "Intermediaire" && $val_candidate['written'] === 'Avance')) 
                                        && (($val_annonce['spoken'] === $val_candidate['spoken']) || ($val_annonce['spoken'] === "Debutant" && 
                                        ($val_candidate['spoken'] === 'Avance') || $val_candidate['spoken'] === 'Intermediaire') || 
                                        ($val_annonce['spoken'] === "Intermediaire" && $val_candidate['spoken'] === 'Avance')&& 
                                        ($val_annonce['language'] === $val_candidate['language']))))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                        foreach($values as $val){
                                            $data_experience = [
                                                'matched_experience' => $val['years'],
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedExperiences::insert($data_experience);
                                        }
                                        $data_language = [
                                            'matched_language' => $language,
                                            'candidate_id' => $candidate->cad_id,
                                            'annonce_id' => $annonce_id,
                                            'read' => $val_candidate['read'],
                                            'written' => $val_candidate['written'],
                                            'spoken' => $val_candidate['spoken'],
                                            'filtring_type' => 'no_hardskill',
                                            'created_at' => date('Y-m-d H:i:s'),
                                            'updated_at' => date('Y-m-d H:i:s'),
                                        ];
                                        MatchedLanguages::insert($data_language);
                                        foreach($soft as $val){
                                            $data_softskills = [
                                                'matched_softskill' => $val,
                                                'candidate_id' => $candidate->cad_id,
                                                'annonce_id' => $annonce_id,
                                                'filtring_type' => 'no_hardskill',
                                                'created_at' => date('Y-m-d H:i:s'),
                                                'updated_at' => date('Y-m-d H:i:s'),
                                            ];
                                            MatchedSoftSkills::insert($data_softskills);
                                        }
                                    }else if(($exp->experience == "Debutant" && $cand->years >= 0) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                    }else if(($exp->experience == "Expert" && $cand->years >= 5) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                    }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && 
                                        (count($result_langauge) >= $count_langauge) && (count($result_softskills) >= $count_softskills))
                                    {
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 1,
                                            'filtring_type' => 'no_hardskill',
                                        ]);
                                    }else{
                                        DB::table('applications')
                                        ->where('candidate_id', $candidate->cad_id)
                                        ->where('annonce_id', $annonce_id)
                                        ->update([
                                            'selected' => 0,
                                            'filtring_type' => '',
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage sans compétences techniques des candidats'
                // ]);
            }
            if($input_filter === "languages"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach($experience_annonce as $exp){
                    foreach($experience_candidat as $cand){
                        foreach($experience_candidat as $cand){
                            if(($exp->experience == "Debutant" && $cand->years >= 0) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills)){
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 1,
                                    'filtring_type' => 'no_language',
                                ]);
                                foreach($values as $val){
                                    $data_experience = [
                                        'matched_experience' => $val['years'],
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedExperiences::insert($data_experience);
                                }
                                foreach($hard as $val){
                                    $data_hardskills = [
                                        'matched_hardskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedHardSkills::insert($data_hardskills);
                                }
                                foreach($soft as $val){
                                    $data_softskills = [
                                        'matched_softskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedSoftSkills::insert($data_softskills);
                                }
                            }else if(($exp->experience == "Expert" && $cand->years >= 5) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills)){
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 1,
                                    'filtring_type' => 'no_language',
                                ]);
                                foreach($values as $val){
                                    $data_experience = [
                                        'matched_experience' => $val['years'],
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedExperiences::insert($data_experience);
                                }
                                foreach($hard as $val){
                                    $data_hardskills = [
                                        'matched_hardskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedHardSkills::insert($data_hardskills);
                                }
                                foreach($soft as $val){
                                    $data_softskills = [
                                        'matched_softskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedSoftSkills::insert($data_softskills);
                                }
                            }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills)){
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 1,
                                    'filtring_type' => 'no_language',
                                ]);
                                foreach($values as $val){
                                    $data_experience = [
                                        'matched_experience' => $val['years'],
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedExperiences::insert($data_experience);
                                }
                                foreach($hard as $val){
                                    $data_hardskills = [
                                        'matched_hardskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedHardSkills::insert($data_hardskills);
                                }
                                foreach($soft as $val){
                                    $data_softskills = [
                                        'matched_softskill' => $val,
                                        'candidate_id' => $candidate->cad_id,
                                        'annonce_id' => $annonce_id,
                                        'filtring_type' => 'no_language',
                                        'created_at' => date('Y-m-d H:i:s'),
                                        'updated_at' => date('Y-m-d H:i:s'),
                                    ];
                                    MatchedSoftSkills::insert($data_softskills);
                                }
                            }else{
                                DB::table('applications')
                                ->where('candidate_id', $candidate->cad_id)
                                ->where('annonce_id', $annonce_id)
                                ->update([
                                    'selected' => 0,
                                    'filtring_type' => '',
                                ]);
                            }
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage sans les compétences linguistiques des candidats'
                // ]);
            }
            if($input_filter === "languages_levels"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_language')
                    ->orWhere('filtring_type', 'not_all')
                    ->delete();
                }
                foreach($experience_annonce as $exp){
                    foreach($experience_candidat as $cand){
                        if(($exp->experience == "Debutant" && $cand->years >= 0) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) && (count($result_langauge) >= $count_langauge)){
                            DB::table('applications')
                            ->where('candidate_id', $candidate->cad_id)
                            ->where('annonce_id', $annonce_id)
                            ->update([
                                'selected' => 1,
                                'filtring_type' => 'no_levels',
                            ]);
                            foreach($values as $val){
                                $data_experience = [
                                    'matched_experience' => $val['years'],
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedExperiences::insert($data_experience);
                            }
                            foreach($hard as $val){
                                $data_hardskills = [
                                    'matched_hardskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedHardSkills::insert($data_hardskills);
                            }
                            foreach($soft as $val){
                                $data_softskills = [
                                    'matched_softskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedSoftSkills::insert($data_softskills);
                            }
                            foreach($lang as $val){
                                $data_language = [
                                    'matched_language' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'read' => '',
                                    'written' => '',
                                    'spoken' => '',
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedLanguages::insert($data_language);
                            }
                        }else if(($exp->experience == "Expert" && $cand->years >= 5) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) && (count($result_langauge) >= $count_langauge)){
                            DB::table('applications')
                            ->where('candidate_id', $candidate->cad_id)
                            ->where('annonce_id', $annonce_id)
                            ->update([
                                'selected' => 1,
                                'filtring_type' => 'no_levels',
                            ]);
                            foreach($values as $val){
                                $data_experience = [
                                    'matched_experience' => $val['years'],
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedExperiences::insert($data_experience);
                            }
                            foreach($hard as $val){
                                $data_hardskills = [
                                    'matched_hardskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedHardSkills::insert($data_hardskills);
                            }
                            foreach($soft as $val){
                                $data_softskills = [
                                    'matched_softskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedSoftSkills::insert($data_softskills);
                            }
                            foreach($lang as $val){
                                $data_language = [
                                    'matched_language' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'read' => '',
                                    'written' => '',
                                    'spoken' => '',
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedLanguages::insert($data_language);
                            }
                        }else if(($exp->experience == "Intermediaire" && $cand->years >= 2) && (count($result_hardskills) >= $count_hardskills) && (count($result_softskills) >= $count_softskills) && (count($result_langauge) >= $count_langauge)){
                            DB::table('applications')
                            ->where('candidate_id', $candidate->cad_id)
                            ->where('annonce_id', $annonce_id)
                            ->update([
                                'selected' => 1,
                                'filtring_type' => 'no_levels',
                            ]);
                            foreach($values as $val){
                                $data_experience = [
                                    'matched_experience' => $val['years'],
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedExperiences::insert($data_experience);
                            }
                            foreach($hard as $val){
                                $data_hardskills = [
                                    'matched_hardskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedHardSkills::insert($data_hardskills);
                            }
                            foreach($soft as $val){
                                $data_softskills = [
                                    'matched_softskill' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedSoftSkills::insert($data_softskills);
                            }
                            foreach($lang as $val){
                                $data_language = [
                                    'matched_language' => $val,
                                    'candidate_id' => $candidate->cad_id,
                                    'annonce_id' => $annonce_id,
                                    'read' => '',
                                    'written' => '',
                                    'spoken' => '',
                                    'filtring_type' => 'no_levels',
                                    'created_at' => date('Y-m-d H:i:s'),
                                    'updated_at' => date('Y-m-d H:i:s'),
                                ];
                                MatchedLanguages::insert($data_language);
                            }
                        }else{
                            DB::table('applications')
                            ->where('candidate_id', $candidate->cad_id)
                            ->where('annonce_id', $annonce_id)
                            ->update([
                                'selected' => 0,
                                'filtring_type' => '',
                            ]);
                        }
                    }
                }
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage sans les niveaux linguistiques des candidats'
                // ]);
            }
            if($input_filter === "not_all"){
                if(count($hardtable) > 0){
                    MatchedHardSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'no_language')
                    ->delete();
                }
                if(count($langtable) > 0){
                    MatchedLanguages::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'no_language')
                    ->delete();
                }
                if(count($exptable) > 0){
                    MatchedExperiences::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'no_language')
                    ->delete();
                }
                if(count($softtable) > 0){
                    MatchedSoftSkills::where('filtring_type', 'no_softskill')
                    ->orWhere('filtring_type', 'all')
                    ->orWhere('filtring_type', 'no_experience')
                    ->orWhere('filtring_type', 'no_hardskill')
                    ->orWhere('filtring_type', 'no_levels')
                    ->orWhere('filtring_type', 'no_language')
                    ->delete();
                }
                DB::table('applications')
                ->where('candidate_id', $candidate->cad_id)
                ->where('annonce_id', $annonce_id)
                ->update([
                    'selected' => 1,
                    'filtring_type' => 'not_all',
                ]);
                $data_experience = [
                    'matched_experience' => 'Filtrage igonré',
                    'candidate_id' => $candidate->cad_id,
                    'annonce_id' => $annonce_id,
                    'filtring_type' => 'not_all',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MatchedExperiences::insert($data_experience);
                $data_softskills = [
                    'matched_softskill' => 'Filtrage igonré',
                    'candidate_id' => $candidate->cad_id,
                    'annonce_id' => $annonce_id,
                    'filtring_type' => 'not_all',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MatchedSoftSkills::insert($data_softskills);
                $data_language = [
                    'matched_language' => 'Filtrage igonré',
                    'candidate_id' => $candidate->cad_id,
                    'annonce_id' => $annonce_id,
                    'filtring_type' => 'not_all',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MatchedLanguages::insert($data_language);
                $data_hardskills = [
                    'matched_hardskill' => 'Filtrage igonré',
                    'candidate_id' => $candidate->cad_id,
                    'annonce_id' => $annonce_id,
                    'filtring_type' => 'not_all',
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MatchedHardSkills::insert($data_hardskills);
                // return response()->json([
                //     'message'=> 'Résultats pour un filtrage sans compténces requises'
                // ]);
            }
        }
    }
    function selectedCandidates($id){
        $selected = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('resumes', 'applications.candidate_id', '=', 'resumes.candidate_id')
        ->where('applications.annonce_id', $id)
        ->where('applications.selected', 1)
        ->get();
        $matched_experiences = DB::table('matched_experiences')
        ->where('matched_experiences.annonce_id', $id)
        ->groupBy('matched_experiences.matched_experience', 'matched_experiences.candidate_id')
        ->get();
        $matched_hardskill = DB::table('matched_hardskills')
        ->where('matched_hardskills.annonce_id', $id)
        ->groupBy('matched_hardskills.matched_hardskill', 'matched_hardskills.candidate_id')
        ->get();
        $matched_language = DB::table('matched_languages')
        ->where('matched_languages.annonce_id', $id)
        ->groupBy('matched_languages.matched_language', 'matched_languages.candidate_id')
        ->get();
        $matched_softskills = DB::table('matched_softskills')
        ->where('matched_softskills.annonce_id', $id)
        ->groupBy('matched_softskills.matched_softskill', 'matched_softskills.candidate_id')
        ->get();
        $quizes = DB::table('quizes')
        ->where('quizes.annonce_id', $id)
        ->get();
        return response()->json([
            "status" => 200,
            "selected" => $selected,
            "expereince" => $matched_experiences,
            "hardskills" =>  $matched_hardskill,
            "langauge" => $matched_language,
            "softskills" => $matched_softskills,
            "quiz" => $quizes,
        ]);
    }
    function sendCandidateTest(Request $request){
        $candidat_id = json_decode($request->input('candidat_id'));
        $quiz_id = $request->input('quiz');
        // echo $quiz_id;
        foreach($candidat_id as $candidate){
            $data_test = [
                'candidate_id' => $candidate->candidate_id,
                'quize_id' => $quiz_id,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            QuizeCandidates::insert($data_test);
        }
        return response()->json([
            'message'=> 'Invitation de test a été bien envoyé'
        ]);
    }
    public function getCandidateApplication(){
        $applications = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->where('applications.candidate_id', Auth::id())
        ->get();
        return response()->json([
            'applications' => $applications,
        ]);
    }
    public function getRecruiterApplication(){
        $applications = DB::table('applications')
        ->join('annonces', 'applications.annonce_id', '=', 'annonces.id')
        ->join('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('applications.summon', 'yes')
        ->get();
        return response()->json([
            'applications' => $applications,
        ]);
    }
    public function sendInvitation(Request $request){
        DB::table('applications')
        ->where('candidate_id', $request->input('candidat_id'))
        ->where('annonce_id', $request->input('annonce_id'))
        ->update([
            'date_interview' => $request->input('date_interview'),
            'time_interview' => $request->input('time_interview'),
        ]);
        return response()->json([
            'message' => "Date d'entretien a été envoyé avec succéss",
        ]);
    }
}