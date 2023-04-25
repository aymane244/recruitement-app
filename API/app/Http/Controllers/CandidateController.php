<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CandidateController extends Controller
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
            'fname' => 'required|string|max:50',
            'lname' => 'required|string|max:50',
            'email' => 'required|email|unique:candidates|max:30',
            'cin' => 'required|string|unique:candidates|max:20',
            'gender' => 'required|string|max:20',
            'birthday' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'candidate_city' => 'required|string|max:20',
            'candidate_adress' => 'required|string|max:100',
            'password' => 'required|confirmed|min:8',
            'photo' => 'nullable|mimes:jpg,jpeg,png'
        ], ['fname.required' => 'Le champs Prénom est obligatoire',
            'fname.max' => 'Le champs Prénom ne doit pas dépasser 50 caractères',
            'lname.required' => 'Le champs Nom est obligatoire',
            'lname.max' => 'Le champs Nom ne doit pas dépasser 50 caractères',
            'email.required' => 'Le champs email est obligatoire',
            'email.unique' => 'Cet email est déjà pris',
            'email.max' => 'Le champs email ne doit pas dépasser 30 caractères',
            'cin.required' => 'Le champs CIN est obligatoire',
            'cin.unique' => 'Cette CIN est déjà pris',
            'cin.max' => 'Le champs CIN ne doit pas dépasser 30 caractères',
            'gender.required' => 'Le champs Sexe est obligatoire',
            'birthday.required' => 'Le champs Date de naissance est obligatoire',
            'phone.required' => 'Le champs N° téléphone est obligatoire',
            'phone.max' => 'Le N° téléphone pays ne doit pas dépasser 20 caractères',
            'candidate_city.required' => 'Le champs ville est obligatoire',
            'candidate_city.max' => 'Le champs ville ne doit pas dépasser 20 caractères',
            'candidate_adress.required' => 'Le champs adresse est obligatoire',
            'candidate_adress.max' => 'Le champs adresse ne doit pas dépasser 100 caractères',
            'password.required' => 'Le champs mot de passe est obligatoire',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas au mot de passe saisit. ',
            'password.min' => 'Le mot de passe doit comporter au moins 8 caractères',
            'photo.mimes' => "L'image doit être de type 'jpg,jpeg,png'",
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $candidate = new Candidate();
            if($request->hasFile('photo')){
                $photo = $request->file('photo');
                $photoname = $photo->getClientOriginalName();
                $photopath = $request->file('photo')->storeAs('candidate/images', $photoname, 'public');
                $candidate->photo = $photopath;
            }
            $candidate->fname = $request->input('fname');
            $candidate->lname = $request->input('lname');
            $candidate->email = $request->input('email');
            $candidate->cin = $request->input('cin');
            $candidate->gender = $request->input('gender');
            $candidate->birthday = $request->input('birthday');
            $candidate->phone = $request->input('phone');
            $candidate->candidate_adress = $request->input('candidate_adress');
            $candidate->candidate_city = $request->input('candidate_city');
            $candidate->password = Hash::make($request->input('password'));
            $candidate->save();
            return response()->json([
                "status" => 200,
                "message" => "Vous êtes bien inscris",
            ]);
        }
    }
    public function login(Request $request){
        $validator = Validator::make($request->all(), [
            'cin' => 'required',
            'password' => 'required',
        ], [
            'cin.required'=> 'Le champs N° CIN est obligatoire',
            'password.required'=> 'Le champs mot de passe est obligatoire'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'empty',
                'messages' => $validator->messages()
            ]);
        }
        //User check
        else if (Auth::guard('candidate')->attempt(['cin' => $request->cin, 'password' => $request->password])) {
            $candidate=Auth::guard('candidate')->user();
            $token = $candidate->createToken('log_token_candidate', ['candidate'])->plainTextToken;
            $success['token'] = $token;
            return response()->json([
                'status' => 'success',
                'data' => $success,
                'candidate'=> $candidate
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'data' => 'Accèss non autorisé'
            ]);
        }
    }
    public function CandidateLogout(Request $request){
        auth('candidate')->logout();
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status'=> 'success',
            'message' => 'Vous êtes déconnecter'
        ]);
    }
    public function getCandidate(){
        $candidate=Auth::user();
        return response()->json([
            'status' => 'success',
            'candidate' => $candidate
        ]);
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
     * @param  \App\Models\Candidate  $candidate
     * @return \Illuminate\Http\Response
     */
    public function show(Candidate $candidate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Candidate  $candidate
     * @return \Illuminate\Http\Response
     */
    public function edit(Candidate $candidate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Candidate  $candidate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Candidate $candidate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Candidate  $candidate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Candidate $candidate)
    {
        //
    }
    public function getAll(){
        $applications = DB::table('applications')
        ->where('applications.candidate_id', Auth::id())
        ->count();
        $applications_get = DB::table('applications')
        ->join('annonces', 'annonces.id', '=', 'applications.annonce_id')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->join('candidates', 'candidates.id', '=', 'applications.candidate_id')
        ->where('applications.candidate_id', Auth::id())
        ->get();
        $quizes = DB::table('quize_candidates')
        ->join('quizes', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->where('quize_candidates.candidate_id', Auth::id())
        ->where('quize_candidates.test', '=', 'passed')
        ->count();
        $quizes_get = DB::table('quize_candidates')
        ->join('quizes', 'quizes.id', '=', 'quize_candidates.quize_id')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->join('candidates', 'candidates.id', '=', 'quize_candidates.candidate_id')
        ->where('quize_candidates.candidate_id', Auth::id())
        ->where('quize_candidates.test', '=', 'passed')
        ->get();
        $saves = DB::table('offres_saved')
        ->where('offres_saved.candidate_id', Auth::id())
        ->count();
        $saves_get = DB::table('offres_saved')
        ->join('annonces', 'annonces.id', '=', 'offres_saved.annonce_id')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->join('candidates', 'candidates.id', '=', 'offres_saved.candidate_id')
        ->where('offres_saved.candidate_id', Auth::id())
        ->get();
        return response()->json([
            'applications' => $applications,
            'quizes' => $quizes,
            'saves' => $saves,
            'applications_get' => $applications_get,
            'quizes_get' => $quizes_get,
            'saves_get' => $saves_get,
        ]);
    }
    public function getCV($id){
        $candidates = DB::table('candidates')->find($id);
        $educations = DB::table('educations')->where('candidate_id',$id)->get();
        $experiences = DB::table('experiences')->where('candidate_id',$id)->get();
        $hard_skills = DB::table('hard_skills')->where('candidate_id',$id)->get();
        $hobbies = DB::table('hobbies')->where('candidate_id',$id)->get();
        $languages = DB::table('languages')->where('candidate_id',$id)->get();
        $resumes = DB::table('resumes')->where('candidate_id',$id)->first();
        $soft_skills = DB::table('soft_skills')->where('candidate_id',$id)->get();

        return response()->json([
            'candidates'=> $candidates,
            'educations'=> $educations,
            'experiences'=> $experiences,
            'hard_skills'=> $hard_skills,
            'hobbies'=> $hobbies,
            'languages'=> $languages,
            'resumes'=> $resumes,
            'soft_skills'=> $soft_skills,
        ]); 
    }
}
