<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Recruiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RecruiterController extends Controller
{
    function store(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|unique:recruiters|max:50',
            'email' => 'required|email|unique:recruiters|max:30',
            'ice' => 'required|string|unique:recruiters|max:20',
            'registre' => 'required|unique:recruiters|string|max:20',
            'recruiter_adress' => 'required|string|max:100',
            'recruiter_country' => 'required|string|max:20',
            'recruiter_city' => 'required|string|max:20',
            'password' => 'required|confirmed|min:8',
            'scan' => 'required|mimes:pdf',
            'logo' => 'required|image|mimes:jpg,jpeg,png'
        ], ['name.required' => 'Le champs nom de l\'entreprise est obligatoire',
            'name.unique' => 'Ce nom d\'entreprise est déjà pris',
            'name.max' => 'Le champs nom de l\'entreprise ne doit pas dépasser 50 caractères',
            'email.required' => 'Le champs email est obligatoire',
            'email.unique' => 'Cet email est déjà pris',
            'email.max' => 'Le champs email ne doit pas dépasser 30 caractères',
            'ice.required' => 'Le champs ICE est obligatoire',
            'ice.unique' => 'Ce N° ICE est déjà pris',
            'ice.max' => 'Le champs ice ne doit pas dépasser 20 caractères',
            'registre.required' => 'Le champs N° registre de commerce est obligatoire',
            'registre.unique' => 'Ce N° de registre de commerce est déjà pris',
            'registre.max' => 'Le champs registre de commerce ne doit pas dépasser 20 caractères',
            'recruiter_adress.required' => 'Le champs adresse de l\'entreprise est obligatoire',
            'recruiter_adress.max' => 'Le champs adresse ne doit pas dépasser 100 caractères',
            'recruiter_country.required' => 'Le champs pays est obligatoire',
            'recruiter_country.max' => 'Le champs pays ne doit pas dépasser 20 caractères',
            'recruiter_city.required' => 'Le champs ville est obligatoire',
            'recruiter_city.max' => 'Le champs ville ne doit pas dépasser 20 caractères',
            'password.required' => 'Le champs mot de passe est obligatoire',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas au mot de passe saisit. ',
            'password.min' => 'Le mot de passe doit comporter au moins 8 caractères',
            'scan.required' => 'Le champs ICE Scanné est obligatoire',
            'scan.mimes' => 'Le fichier ICE Scanné doit être de type pdf',
            'logo.required' => 'Le champs logo est obligatoire',
            'logo.image' => 'Le fichier logo doit être un fichier de type image. ',
            'logo.mimes' => "L'image doit être de type 'jpg,jpeg,png'",
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $recruiter = new Recruiter;
            if($request->hasFile('scan')){
                $file = $request->file('scan');
                $filename = $file->getClientOriginalName();
                $filepath = $request->file('scan')->storeAs('recruiter/files', $filename, 'public');
                $recruiter->scan = $filepath;
            }
            if($request->hasFile('logo')){
                $logo = $request->file('logo');
                $logoname = $logo->getClientOriginalName();
                $logopath = $request->file('logo')->storeAs('recruiter/images', $logoname, 'public');
                $recruiter->logo = $logopath;
            }
            $recruiter->name = $request->input('name');
            $recruiter->email = $request->input('email');
            $recruiter->ice = $request->input('ice');
            $recruiter->registre = $request->input('registre');
            $recruiter->recruiter_adress = $request->input('recruiter_adress');
            $recruiter->recruiter_country = $request->input('recruiter_country');
            $recruiter->recruiter_city = $request->input('recruiter_city');
            $recruiter->password = Hash::make($request->input('password'));
            $recruiter->save();
            return response()->json([
                "status" => 200,
                "message" => "Vous êtes bien inscris",
            ]);
        }
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ice' => 'required',
            'password' => 'required',
        ], [
            'ice.required'=> 'Le champs ICE est obligatoire',
            'password.required'=> 'Le champs mot de passe est obligatoire'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'empty',
                'messages' => $validator->messages()
            ]);
        }
        //User check
        else if (Auth::guard('recruiter')->attempt(['ice' => $request->ice, 'password' => $request->password])) {
            $recruiter=Auth::guard('recruiter')->user();
            //Setting login response
            $token = $recruiter->createToken('log_token_recruiter', ['recruiter'])->plainTextToken;
            $success['token'] = $token;
            return response()->json([
                'status' => 'success',
                'data' => $success,
                'recruiter'=> $recruiter
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'data' => 'Accèss non autorisé'
            ]);
        }
    }
    public function recruiterLogout(Request $request)
    {
        auth('recruiter')->logout();
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status'=> 'success',
            'message' => 'Logged out succefully'
        ]);
    }
    public function getRecruiter(){
        $recruiter=Auth::user();
        // $annonces=auth()->user()->annonces()->first();
        $annonces = DB::table('annonces')->where('recruiter_id', Auth::id())->get();
        return response()->json([
            'status' => 'success',
            'recruite' => $recruiter,
            'annonces' => $annonces,
        ]);
    }
    public function getOffers(){
        $annonces_list = DB::table('annonces')
        ->where('annonces.recruiter_id', Auth::id())
        ->orderByDesc('annonces.created_at')
        ->limit(10)
        ->get();
        $annonces = DB::table('annonces')
        ->where('annonces.recruiter_id', Auth::id())
        ->count();
        $annonces_open = DB::table('annonces')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('annonces.isOpen', '=', '1')
        ->count();
        $annonces_close = DB::table('annonces')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('annonces.isOpen', '=', '0')
        ->count();
        $applications = DB::table('applications')
        ->join('annonces', 'annonces.id', '=', 'applications.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->count();
        $applications_list = DB::table('applications')
        ->join('annonces', 'annonces.id', '=', 'applications.annonce_id')
        ->join('candidates', 'candidates.id', '=', 'applications.candidate_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->orderByDesc('applications.created_at')
        ->limit(10)
        ->get();
        $applications_success = DB::table('applications')
        ->join('annonces', 'annonces.id', '=', 'applications.annonce_id')
        ->join('candidates', 'candidates.id', '=', 'applications.candidate_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('applications.summon', '=', 'yes')
        ->orderByDesc('applications.created_at')
        ->limit(10)
        ->get();
        $success = DB::table('applications')
        ->join('annonces', 'annonces.id', '=', 'applications.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->where('applications.summon', '=', 'yes')
        ->count();
        $quiz = DB::table('quizes')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->count();
        $quiz_list = DB::table('quizes')
        ->join('annonces', 'annonces.id', '=', 'quizes.annonce_id')
        ->where('annonces.recruiter_id', Auth::id())
        ->orderByDesc('quizes.created_at')
        ->limit(10)
        ->get();
        $recommandations = DB::table('recommendations')
        ->where('recommendations.recruiter_id', Auth::id())
        ->count();  
        $recommandations_list = DB::table('recommendations')
        ->join('candidates', 'candidates.id', '=', 'recommendations.candidate_id')
        ->join('recruiters', 'recruiters.id', '=', 'recommendations.recruiter_id')
        ->join('resumes', 'resumes.candidate_id', '=', 'candidates.id')
        ->get();  
        return response()->json([
            'annonces' => $annonces,
            'annonces_open' => $annonces_open,
            'annonces_close' => $annonces_close,
            'annonces_list' => $annonces_list,
            'applications' => $applications,
            'applications_list' => $applications_list,
            'applications_success' => $applications_success,
            'success' => $success,
            'quiz' => $quiz,
            'quiz_list' => $quiz_list,
            'recommandations' => $recommandations,
            'recommandations_list' => $recommandations_list,
        ]);
    }
    public function editRecruiter($id){
        $recruiter = DB::table('recruiters')->find($id);
        return response()->json([
            'recruiter'=> $recruiter,
        ]);
    }
    public function updateRecruiter(Request $request, $id){
        $recruiter = Recruiter::find($id);
        if ($request->hasFile('logo')) {
            File::delete(public_path("storage/recruiter/images/".$recruiter->logo));
            $logo = $request->file('logo');
            $logoname = $logo->getClientOriginalName();
            $logopath = $request->file('logo')->storeAs('recruiter/images', $logoname, 'public');
            $recruiter->logo = $logopath;
        }
        if($request->hasFile('scan')){
            File::delete(public_path("storage/recruiter/files/".$recruiter->scan));
            $scan = $request->file('scan');
            $scanname = $scan->getClientOriginalName();
            $scanpath = $request->file('scan')->storeAs('recruiter/files', $scanname, 'public');
            $recruiter->scan = $scanpath;
        }
        $recruiter->name = $request->input('name');
        $recruiter->email = $request->input('email');
        $recruiter->ice = $request->input('ice');
        $recruiter->registre = $request->input('registre');
        $recruiter->recruiter_adress = $request->input('recruiter_adress');
        $recruiter->recruiter_country = $request->input('recruiter_country');
        $recruiter->recruiter_city = $request->input('recruiter_city');
        $recruiter->update();
        return response()->json([
            'status' => 200,
            'message' => 'Vous avez bien mis à jour votre profile'
        ]);
    }
}
