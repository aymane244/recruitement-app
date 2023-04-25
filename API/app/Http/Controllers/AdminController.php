<?php

namespace App\Http\Controllers;

use App\Models\MetadataHardskills;
use App\Models\MetadataLanguages;
use App\Models\MetadataSoftskills;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|unique:users|max:30',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
            'password' => 'required|confirmed|min:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message_errors' => $validator->messages()
            ]);
        } else {
            $admin = new User;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = $file->getClientOriginalName();
                $filepath = $request->file('image')->storeAs('admin', $filename, 'public');
                $admin->image = $filepath;
            }
            $admin->first_name = $request->input('first_name');
            $admin->last_name = $request->input('last_name');
            $admin->email = $request->input('email');
            $admin->password = Hash::make($request->input('password'));
            // crypt($request->input('password'));
            // crypt($request->input('password'));
            $admin->save();
            return response()->json([
                "status" => 200,
                "message" => "Vous êtes bien inscris",
            ]);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'empty',
                'messages' => $validator->messages()
            ]);
        }
        //User check
        else if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            Auth::user();
            $token = $request->user()->createToken('log_token_admin')->plainTextToken;
            $success['token'] = $token;
            return response()->json([
                'status' => 'success',
                'data' => $success,
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'data' => 'Accèss non autorisé'
            ]);
        }
    }
    public function logout(Request $request){
        auth('web')->logout();
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status'=> 'success',
            'message' => 'Logged out succefully'
        ]);
    }
    public function getUserLogged(){
        $admin = Auth::user();
        return response()->json([
            'status' => 'success',
            'admin' => $admin
        ]);
    }
    public function getRecruiters(){
        $entreprises = DB::table('annonces')
        ->rightJoin('recruiters', 'annonces.recruiter_id', '=', 'recruiters.id')
        ->select('recruiters.name', 'recruiters.email', 'recruiters.ice', 'recruiters.registre', 'recruiters.recruiter_country', 'recruiters.recruiter_city', 'recruiters.id as recruiter', DB::raw('count(annonces.id) as annonces'))
        ->groupBy('recruiters.id')
        ->get();
        return response()->json([
            'entreprise'=> $entreprises,
        ]);
    }
    public function getCandidates(){
        $candidates = DB::table('applications')
        ->rightJoin('candidates', 'applications.candidate_id', '=', 'candidates.id')
        ->select('candidates.fname', 'candidates.lname', 'candidates.email', 'candidates.cin', 'candidates.candidate_city', 'candidates.id as candidate', DB::raw('count(applications.id) as application'), 'applications.summon as selection')
        ->groupBy('candidates.id')
        ->get();
        return response()->json([
            'candidates'=> $candidates,
        ]);
    }
    public function getOffers(){
        $annonces = DB::table('annonces')
        ->join('recruiters', 'annonces.recruiter_id', '=', 'recruiters.id')
        ->select('recruiters.name', 'recruiters.recruiter_country', 'annonces.job_position', 'annonces.annonce_city', 'recruiters.id as recruiter', 'annonces.id as annonce', 'annonces.isOpen')
        ->get();
        return response()->json([
            'annonces'=> $annonces,
        ]);
    }
    public function updateAnnonceState(Request $request){
        $id = $request->input('id');
        $checkOpen = DB::table('annonces')
        ->select('annonces.isOpen')
        ->where('annonces.id', $id)
        ->get();
        foreach($checkOpen as $checked){
            if($checked->isOpen === 1){
                DB::table('annonces')
                ->where('annonces.id', $request->input('id'))
                ->update([
                    'isOpen' => 0,
                ]);
            }else{
                DB::table('annonces')
                ->where('annonces.id', $request->input('id'))
                ->update([
                    'isOpen' => 1,
                ]);
            }

        }
    }
    public function addLanguage(Request $request){
        $validator = Validator::make($request->all(),[
            'language' => 'required|string|unique:metadata_languages|max:3000',
        ],[
            'language.required' => 'Le champs Langue est obligatoire',
            'language.max' => 'Le champs Langue ne doit pas dépasser 3000 caractères',
            'language.unique' => 'Langue déjà saisit',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $lang = json_decode($request->input('lang'));
            foreach($lang as $value){
                $data = [
                    'language' => $value->language,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MetadataLanguages::insert($data);
                return response()->json([
                    'status' => 200,
                    'message' => 'La Langue '.$value->language.' enregistré avec succèss'
                ]);
            }
        }
    }
    public function getLanguages(){
        $languages = DB::table('metadata_languages')->groupBy('language')->get();
        return response()->json(['languages' => $languages]);
    }
    public function addSoftskills(Request $request){
        $validator = Validator::make($request->all(),[
            'softskills' => 'required|string|unique:metadata_softskills|max:3000',
        ],[
            'softskills.required' => 'Le champs Compétences personnelles est obligatoire',
            'softskills.max' => 'Le champs Compétences personnelles ne doit pas dépasser 3000 caractères',
            'softskills.unique' => 'Compétence personnelle déjà saisit',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $soft = json_decode($request->input('soft'));
            foreach($soft as $value){
                $data = [
                    'softskills' => $value->softskills,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MetadataSoftskills::insert($data);
            }
            return response()->json([
                'status' => 200,
                'message' => 'La Compétence personnelle '.$value->softskills.' enregistrée avec succèss'
            ]);
        }
    }
    public function getSoftskills(){
        $softskills = DB::table('metadata_softskills')->groupBy('softskills')->get();
        return response()->json(['softskills' => $softskills]);
    }
    public function addHardskills(Request $request){
        $validator = Validator::make($request->all(),[
            'hardskills' => 'required|string|unique:metadata_hardskills|max:3000',
        ],[
            'hardskills.required' => 'Le champs Compétences techniques est obligatoire',
            'hardskills.max' => 'Le champs Compétences techniques ne doit pas dépasser 3000 caractères',
            'hardskills.unique' => 'Compétence technique déjà saisit',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $hard = json_decode($request->input('hard'));
            foreach($hard as $value){
                $data = [
                    'hardskills' => $value->hardskills,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                MetadataHardskills::insert($data);
            }
            return response()->json([
                'status' => 200,
                'message' => 'La Compétence technique '.$value->hardskills.' enregistrée avec succèss'
            ]);
        }
    }
    public function getHardskills(){
        $hardskills = DB::table('metadata_hardskills')->groupBy('hardskills')->get();
        return response()->json(['hardskills' => $hardskills]);
    }
    public function getAllusers(){
        $candidates = DB::table('candidates')->count();
        $candidates_limit = DB::table('candidates')->limit(10)->get();
        $candidates_today = DB::table('candidates')->where(DB::raw('DATE(candidates.created_at)'), date('Y-m-d'))->count();
        $recruiters = DB::table('recruiters')->count();
        $recruiters_limit = DB::table('recruiters')->limit(10)->get();
        $recruiters_today = DB::table('recruiters')->where(DB::raw('DATE(recruiters.created_at)'), date('Y-m-d'))->count();
        $offers = DB::table('annonces')->count();
        $offers_limit = DB::table('annonces')
        ->join('recruiters', 'recruiters.id', '=', 'annonces.recruiter_id')
        ->limit(10)
        ->get();
        $offers_today = DB::table('annonces')->where(DB::raw('DATE(annonces.created_at)'), date('Y-m-d'))->count();
        return response()->json([
            'candidates'=> $candidates,
            'candidates_today'=> $candidates_today,
            'candidates_limit'=> $candidates_limit,
            'recruiters'=> $recruiters,
            'recruiters_today'=> $recruiters_today,
            'recruiters_limit'=> $recruiters_limit,
            'offers'=> $offers,
            'offers_today'=> $offers_today,
            'offers_limit'=> $offers_limit,
        ]);
    }
    public function deleteSoftMetada($id){
        $soft = MetadataSoftskills::find($id);
        if($soft){
            $deleted_soft = $soft->softskills;
            DB::table('metadata_softskills')->delete($id);
            return response()->json([
                'message' => 'La compétence '.$deleted_soft.' supprimée avec success'
            ]);
        }
    }
    public function deleteLangMetada($id){
        $lang = MetadataLanguages::find($id);
        if($lang){
            $deleted_lang = $lang->language;
            DB::table('metadata_languages')->delete($id);
            return response()->json([
                'message' => 'La langue '.$deleted_lang.' supprimée avec success'
            ]);
        }
    }
    public function deleteHardMetada($id){
        $hard = MetadataHardskills::find($id);
        if($hard){
            $deleted_hard = $hard->hardskills;
            DB::table('metadata_hardskills')->delete($id);
        }
        return response()->json([
            'message' => 'La compéténce '.$deleted_hard.' supprimée avec success'
        ]);
    }
    public function editAdmin($id){
        $admin = DB::table('users')->find($id);
        return response()->json([
            'admin'=> $admin,
        ]);
    }
    public function updateAdmin(Request $request, $id){
        $admin = User::find($id);
        if ($request->hasFile('image')) {
            File::delete(public_path("storage/admin/images/".$admin->image));
            $image = $request->file('image');
            $imagename = $image->getClientOriginalName();
            $imagepath = $request->file('image')->storeAs('admin/images', $imagename, 'public');
            $admin->intl_get_error_message = $imagepath;
        }
        $admin->first_name = $request->input('first_name');
        $admin->last_name = $request->input('last_name');
        $admin->email = $request->input('email');
        $admin->update();
        return response()->json([
            'status' => 200,
            'message' => 'Vous avez bien mis à jour votre profile'
        ]);
    }
}
