<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Certificate;
use App\Models\HardSkills;
use App\Models\Hobbies;
use App\Models\Language;
use App\Models\SoftSkills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AnnonceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request){
        $validator = Validator::make($request->all(),[
            'job_position' => 'required|string|max:500',
            'job_description' => 'required|string|max:100000',
            'annonce_city' => 'required|string|max:30',
            'study' => 'required|string|max:500',
            'position' => 'required|numeric|max:10',
            'certificate' => 'required|string|max:1000',
            'salary' => 'required|string|max:1000',
            'contract' => 'required|string|max:20',
            'experience' => 'required|string|max:20',
            'softskills' => 'required|string|max:2000',
            'hardskills' => 'required|string|max:2000',
            'language' => 'required|string|max:2000',
            'read' => 'required|string|max:2000',
            'written' => 'required|string|max:2000',
            'spoken' => 'required|string|max:2000',
        ], ['job_position.required' => 'Le champs Titre de poste est obligatoire',
            'job_position.max' => 'Le champs Titre de position ne doit pas dépasser 500 caractères',
            'job_description.required' => 'Le champs Déscription du poste est obligatoire',
            'job_description.max' => 'Le champs Déscription du poste ne doit pas dépasser 100000 caractères',
            'position.required' => 'Le champs Poste est obligatoire',
            'position.max' => 'Le champs Poste ne doit pas dépasser 10 caractères',
            'annonce_city.required' => 'Le champs ville est obligatoire',
            'annonce_city.max' => 'Le champs Ville ne doit pas dépasser 30 caractères',
            'study.required' => 'Le champs Etude est obligatoire',
            'study.max' => 'Le champs Etude ne doit pas dépasser 500 caractères',
            'salary.required' => 'Le champs Salaire est obligatoire',
            'salary.max' => 'Le champs Salaire ne doit pas dépasser 1000 caractères',
            'certificate.required' => 'Le champs Branche est obligatoire',
            'certificate.max' => 'Le champs Branche ne doit pas dépasser 1000 caractères',
            'contract.required' => 'Le champs contrat de naissance est obligatoire',
            'contract.max' => 'Le champs Contrat ne doit pas dépasser 20 caractères',
            'experience.required' => 'Le champs Expérience est obligatoire',
            'experience.max' => 'Le  champs Expérience pays ne doit pas dépasser 20 caractères',
            'softskills.required' => 'Le champs Compétence personnelle est obligatoire',
            'softskills.max' => 'Le  champs Compétence personnelle ne doit pas dépasser 2000 caractères',
            'hardskills.required' => 'Le champs Compétence technique est obligatoire',
            'hardskills.max' => 'Le  champs Compétence technique ne doit pas dépasser 2000 caractères',
            'language.required' => 'Le champs Langue est obligatoire',
            'language.max' => 'Le  champs language ne doit pas dépasser 2000 caractères',
            'read.required' => 'Le champs Niveau lu est obligatoire',
            'read.max' => 'Le  champs Niveau lu ne doit pas dépasser 2000 caractères',
            'written.required' => 'Le champs Niveau écrit est obligatoire',
            'written.max' => 'Le  champs Niveau écrit ne doit pas dépasser 2000 caractères',
            'spoken.required' => 'Le champs Niveau parlé est obligatoire',
            'spoken.max' => 'Le  champs Niveau parlé ne doit pas dépasser 2000 caractères',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $annonce = new Annonce();
            $annonce->job_position = $request->input('job_position');
            $annonce->job_description = $request->input('job_description');
            $annonce->annonce_city = $request->input('annonce_city');
            $annonce->study = $request->input('study');
            $annonce->salary = $request->input('salary');
            $annonce->contract = $request->input('contract');
            $annonce->experience = $request->input('experience');
            $annonce->position = $request->input('position');
            $annonce->recruiter_id = $request->input('recruiter');
            $annonce->save();
            $soft = json_decode($request->input('soft'));
            $hard = json_decode($request->input('hard'));
            $lang = json_decode($request->input('lang'));
            $certificate = json_decode($request->input('certif'));
            foreach($certificate as $value){
                foreach($value as $field){
                    $data = [
                        'certficates' => $field,
                        'annonce_id' => $annonce->id,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    Certificate::insert($data);
                }
            }   
            foreach($soft as $value){
                foreach($value as $skill){
                    $data = [
                        'softskills' => $skill,
                        'annonce_id' => $annonce->id,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    SoftSkills::insert($data);
                }
            }        
            foreach($hard as $value){
                foreach($value as $skill){
                    $data = [
                        'hardskills' => $skill,
                        'annonce_id' => $annonce->id,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    HardSkills::insert($data);
                }
            }        
            foreach($lang as $value){
                $data = [
                    'language' => $value->language,
                    'read' => $value->read,
                    'written' => $value->written,
                    'spoken' => $value->spoken,
                    'annonce_id' => $annonce->id,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                Language::insert($data);
            }
            return response()->json([
                "status" => 200,
                "message" => "Votre annonce a été bien enregistrer",
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function show(){
        $annonces = DB::table('annonces')
        ->join('recruiters', 'annonces.recruiter_id', '=', 'recruiters.id')
        ->select('annonces.id as annonce_id', 'recruiters.logo', 'annonces.annonce_city', 'recruiters.recruiter_country', 'recruiters.name', 'annonces.contract', 'annonces.created_at', 'annonces.updated_at', 'annonces.job_description', 'annonces.job_position')
        ->where('annonces.isOpen', '=', '1')
        ->get();
        $cities = DB::table('annonces')
        ->join('recruiters', 'annonces.recruiter_id', '=', 'recruiters.id')
        ->select('annonces.annonce_city')
        ->groupBy('annonces.annonce_city')
        ->get();
        return response()->json([
            "status" => 200,
            "annonces" => $annonces,
            "cities" => $cities,
        ]);
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function edit($id){
        $annonce = DB::table('annonces')->find($id);
        $softskills = DB::table('soft_skills')->where('soft_skills.annonce_id', $id)->get();
        $hardskills = DB::table('hard_skills')->where('hard_skills.annonce_id', $id)->get();
        $languages = DB::table('languages')->where('languages.annonce_id', $id)->get();
        $recruiter = DB::table('recruiters')
            ->join('annonces', 'recruiters.id', '=', 'annonces.recruiter_id')
            ->select('annonces.id as annonce', 'recruiters.id as recruiter', 'recruiters.logo', 'recruiters.name', 'recruiters.recruiter_country')
            ->where('annonces.id', $id)
            ->get();
        return response()->json([
            'recruiter' => $recruiter,
            'annonce' => $annonce,
            'softskills' => $softskills,
            'hardskills' => $hardskills,
            'languages' => $languages,
        ]);
    }
    public function checkResume(){
        $resume = DB::table('resumes')->where('resumes.candidate_id', Auth::id())->get();
        $letter = DB::table('cover_letters')->where('cover_letters.candidate_id', Auth::id())->get();
        return response()->json([
            'resume'=> $resume,
            'letter'=> $letter,
        ]);
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Annonce $annonce)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Annonce  $annonce
     * @return \Illuminate\Http\Response
     */
    public function destroy(Annonce $annonce)
    {
        //
    }
    public function getMetadata(){
        $languages = DB::table('metadata_languages')->select('metadata_languages.language')->groupBy('language')->get();
        $softskills = DB::table('metadata_softskills')->select('metadata_softskills.softskills')->groupBy('softskills')->get();
        $hardskills = DB::table('metadata_hardskills')->select('metadata_hardskills.hardskills')->groupBy('hardskills')->get()->toArray();
        return response()->json([
            'languages'=> $languages,
            'softskills'=> $softskills,
            'hardskills'=> $hardskills,
        ]);
    }
    public function editAnnonce($id){
        $annonce = DB::table('annonces')->find($id);
        $hardskills = DB::table('hard_skills')->where('hard_skills.annonce_id',$id)->get();
        $languages = DB::table('languages')->where('languages.annonce_id',$id)->get();
        $softskills = DB::table('soft_skills')->where('soft_skills.annonce_id',$id)->get();
        $certificates = DB::table('certificates')->where('certificates.annonce_id',$id)->get();
        return response()->json([
            'annonce'=> $annonce,
            'hardskills'=> $hardskills,
            'languages'=> $languages,
            'softskills'=> $softskills,
            'certificates'=> $certificates,
        ]);
    }
    public function updateAnnonce(Request $request, $id){
        $annonce = Annonce::find($id);
        $annonce->job_position = $request->input('job_position');
        $annonce->job_description = $request->input('job_description');
        $annonce->annonce_city = $request->input('annonce_city');
        $annonce->position = $request->input('position');
        $annonce->study = $request->input('study');
        $annonce->contract = $request->input('contract');
        $annonce->experience = $request->input('experience');
        $annonce->salary = $request->input('salary');
        $annonce->update();
        $soft = json_decode($request->input('soft'));
        $hard = json_decode($request->input('hard'));
        $lang = json_decode($request->input('lang'));
        $certificate = json_decode($request->input('certif'));
        foreach($certificate as $value){
            $data = [
                'certficates' => $value->certficates,
                'annonce_id' => $id,
            ];
            if(isset($value->id)){
                $data['id'] = $value->id;
            }
            Certificate::upsert(
                $data,
                ['id', 'annonce_id'], 
                ['certficates']
            );
        }   
        foreach($soft as $value){
            $data = [
                'softskills' => $value->softskills,
                'annonce_id' => $id,
            ];
            if(isset($value->id)){
                $data['id'] = $value->id;
            }
            SoftSkills::upsert(
                $data,
                ['id', 'annonce_id'], 
                ['softskills']
            );
        }        
        foreach($hard as $value){
            $data = [
                'hardskills' => $value->hardskills,
                'annonce_id' => $id,
            ];
            if(isset($value->id)){
                $data['id'] = $value->id;
            }
            HardSkills::upsert(
                $data,
                ['id', 'annonce_id'], 
                ['hardskills']
            );
        }        
        foreach($lang as $value){
            $data = [
                'language' => $value->language,
                'annonce_id' => $id,
                'read' => $value->read,
                'written' => $value->written,
                'spoken' => $value->spoken,
            ];
            if(isset($value->id)){
                $data['id'] = $value->id;
            }
            Language::upsert(
                $data,
                ['id', 'annonce_id'], 
                ['language', 'read', 'written', 'spoken']
            );
        }
        return response()->json([
            "status" => 200,
            "message" => "Votre annonce a été bien mis à jour",
        ]);
    }
    public function dropCertificate($id){
        $certificate = Certificate::find($id);
        if($certificate){
            $deleted_certificate = $certificate->softskills;
            DB::table('certificates')->delete($id);
        }
        return response()->json([
            'message' => 'La compétence '.$deleted_certificate.' supprimée avec success'
        ]);
    }
    public function dropHardskills($id){
        $hardskill = HardSkills::find($id);
        if($hardskill){
            $deleted_hardskill = $hardskill->softskills;
            DB::table('hard_skills')->delete($id);
        }
        return response()->json([
            'message' => 'La compétence '.$deleted_hardskill.' supprimée avec success'
        ]);
    }
    public function dropSoftskills($id){
        $softskills = SoftSkills::find($id);
        if($softskills){
            $deleted_softskills = $softskills->softskills;
            DB::table('soft_skills')->delete($id);
            return response()->json([
                'message' => 'La compétence '.$deleted_softskills.' supprimée avec success'
            ]);
        }
    }
    public function dropLanguage($id){
        $language = Language::find($id);
        if($language){
            $deleted_language = $language->language;
            DB::table('languages')->delete($id);
            return response()->json([
                'message' => 'La langue '.$deleted_language.' supprimée avec success'
            ]);
        }
    }
    public function deleteAnnonce($id){
        $annonce = Annonce::find($id);
        if($annonce){
            $deleted_annonce = $annonce->job_position;
            DB::table('annonces')->delete($id);
            return response()->json([
                'message' => "L'annonce ".$deleted_annonce." supprimée avec success"
            ]);
        }
    }
}
