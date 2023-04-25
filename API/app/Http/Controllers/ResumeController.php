<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Education;
use App\Models\Experience;
use App\Models\ExperincesYears;
use App\Models\HardSkills;
use App\Models\Hobbies;
use App\Models\Language;
use App\Models\Resume;
use App\Models\SoftSkills;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ResumeController extends Controller
{
    public function getProfil(){
        $resumesCount = DB::table('resumes')->where('candidate_id', Auth::id())->count();
        $resumes = DB::table('resumes')->where('candidate_id', Auth::id())->get();
        $eductaions = DB::table('educations')->where('candidate_id', Auth::id())->get();
        $experiences = DB::table('experiences')->where('candidate_id', Auth::id())->get();
        $hardSkills = DB::table('hard_skills')->where('candidate_id', Auth::id())->get();
        $hobbies = DB::table('hobbies')->where('candidate_id', Auth::id())->get();
        $languages = DB::table('languages')->where('candidate_id', Auth::id())->get();
        $softSkills = DB::table('soft_skills')->where('candidate_id', Auth::id())->get();
        $message = '';
        if(empty($resumesCount)){
            $message = "empty";
        }else{
            $message = "not empty";
        }
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'eductaions' => $eductaions,
            'experiences' => $experiences,
            'hardSkills' => $hardSkills,
            'hobbies' => $hobbies,
            'languages' => $languages,
            'softSkills' => $softSkills,
            'resume' => $resumes,
        ]);
    }
    public function createProfil(Request $request){
        $validator = Validator::make($request->all(),[
            'profil' => 'required|string|max:500',
        ], ['profil.required' => 'Le champs Profil est obligatoire',
            'profil.max' => 'Le champs Profil ne doit pas dépasser 500 caractères',
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=> 400,
                'message_errors'=> $validator->messages()
            ]);
        }else{
            $profil = new Resume();
            $profil->profil = $request->input('profil');
            $profil->candidate_id = $request->input('profil_id');
            $profil->save();
            return response()->json([
                'status' => 200,
                'message' => 'Profil enregistrer avec succèss'
            ]);
        }
    }
    function createReusme(Request $request){
        Resume::where('candidate_id', $request->input('candidate'))
        ->update(['profil'=> $request->input('profil'), 'summuray'=> $request->input('summuray')]);
        $check = DB::table('experiences_years')->where('experiences_years.candidate_id', $request->input('candidate'))->count();
        if($check > 0){
            DB::table('experiences_years')
                ->where('candidate_id', $request->input('candidate'))
                ->update([
                'years' => $request->input('years_experience'),
            ]);
        }else{
            $years = new ExperincesYears();
            $years->candidate_id = $request->input('candidate');
            $years->years = $request->input('years_experience');
            $years->save();
        }
        $candidate = Candidate::find($request->input('candidate'));
        if($request->hasFile('image')){
            File::delete(public_path("storage/candidates/images/".$candidate->photo));
            $photo = $request->file('image');
            $photoname = $photo->getClientOriginalName();
            $photopath = $request->file('image')->storeAs('candidate/images', $photoname, 'public');
            $candidate->photo = $photopath;
        }
        $candidate->email = $request->input('email');
        $candidate->phone = $request->input('phone');
        $candidate->candidate_adress = $request->input('candidate_adress');
        $candidate->fname = $request->input('fname');
        $candidate->lname = $request->input('lname');
        $candidate->birthday = $request->input('birthday');
        $candidate->update();
        $candidate = json_decode($request->input('candidate'));
        $soft = json_decode($request->input('softskills'));
        $hard = json_decode($request->input('hardskills'));
        $lang = json_decode($request->input('languages'));
        $hobb = json_decode($request->input('hobbies'));
        $educations = json_decode($request->input('education'));
        $experiences = json_decode($request->input('experience'));
        $update_soft = json_decode($request->input('sof_update')) ;
        $update_hard = json_decode($request->input('hard_update')) ;
        $update_lang = json_decode($request->input('lang_update')) ;
        $update_hobby = json_decode($request->input('hobby_update')) ;
        $update_education = json_decode($request->input('education_update')) ;
        $update_experience = json_decode($request->input('experience_update')) ;
        if($request->input('softskill') !== null){
            foreach($soft as $value){
                foreach($value as $skill){
                    $data = [
                        'candidate_id' => $request->input('candidate'), 
                        'softskills' => $skill,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    SoftSkills::insert($data);
                }
            }
        }else{
            foreach($update_soft as $item){
                SoftSkills::updateOrCreate(
                    ['id' => $item->id],
                    ['softskills' => $item->softskills],
                    ['updated_at' => date('Y-m-d H:i:s')],
                );
            }
        }
        if($request->input('hardskill') !== null){
            foreach($hard as $value){
                foreach($value as $skill){
                    $data = [
                        'candidate_id' => $request->input('candidate'),
                        'hardskills' => $skill,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    HardSkills::insert($data);
                }
            }
        }else{
            foreach($update_hard as $item){
                HardSkills::updateOrCreate(
                    ['id' => $item->id],
                    ['hardskills' => $item->hardskills],
                    ['updated_at' => date('Y-m-d H:i:s')],
                );
            }
        }
        if($request->input('language') !== null){
            foreach($lang as $value){
                $data = [
                    'candidate_id' => $request->input('candidate'),
                    'language' => $value->languages,
                    'read' => $value->read,
                    'written' => $value->written,
                    'spoken' => $value->spoken,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                Language::insert($data);
            }
        }else{
            foreach($update_lang as $item){
                $data = [
                    'id' => $item->id,
                    'language' => $item->language,
                    'read' => $item->read,
                    'written' => $item->written,
                    'spoken' => $item->spoken,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                DB::table('languages')
                ->where('id', $item->id)
                ->update($data);
            }
        }
        if($request->input('hobbie') !== null){
            foreach($hobb as $value){
                foreach($value as $hobby){
                    $data = [
                        'candidate_id' => $request->input('candidate'),
                        'hobbie' => $hobby,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s'),
                    ];
                    Hobbies::insert($data);
                }
            }
        }else{
            foreach($update_hobby as $item){
                Hobbies::updateOrCreate(
                    ['id' => $item->id],
                    ['hobbie' => $item->hobbie],
                    ['updated_at' => date('Y-m-d H:i:s')],
                );
            }
        }    
        if($request->input('education_date') !== null && $request->input('certificate') !== null && $request->input('school') !== null){
            foreach($educations as $education){
                $data = [
                    'candidate_id' => $candidate,
                    'education_date' => $education->education_date, 
                    'certificate' => $education->certificate,
                    'school' => $education->school,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                Education::insert($data);
            }    
        }else{
            foreach($update_education as $item){
                $data = [
                    'id' => $item->id,
                    'education_date' => $item->education_date,
                    'certificate' => $item->certificate,
                    'school' => $item->school,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                DB::table('educations')
                ->where('id', $item->id)
                ->update($data);
            }
        }
        if($request->input('tasks') !== null && $request->input('entreprise') !== null && $request->input('experience_country') !== null 
            && $request->input('experience_city') !== null && $request->input('position') !== null && $request->input('date_begin') !== null
            && $request->input('date_end') !== null){
            foreach($experiences as $experience){
                $data = [
                    'tasks' => $experience->tasks, 
                    'entreprise' => $experience->entreprise,
                    'experience_country' => $experience->experience_country,
                    'experience_city' => $experience->experience_city,
                    // 'years_experience' => $request->input('years_experience'),
                    'position' => $experience->position,
                    'date_begin' => $experience->date_begin,
                    'date_end' => $experience->date_end,
                    'candidate_id' => $candidate,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s'),
                ];
                Experience::insert($data);
            }
        }else{
            foreach($update_experience as $item){
                $data = [
                    'id' => $item->id, 
                    'tasks' => $item->tasks,
                    'entreprise' => $item->entreprise,
                    'experience_country' => $item->experience_country,
                    'years_experience' => $item->years_experience,
                    'experience_city' => $item->experience_city,
                    'position' => $item->position,
                    'date_begin' => $item->date_begin,
                    'date_end' => $item->date_end,
                    'updated_at' => date('Y-m-d H:i:s')
                ];
                DB::table('experiences')
                ->where('id', $item->id)
                ->update($data);
            }
        }         
        return response()->json([
            'status'=> 200,
            'message'=> 'Vos données sont bien enregistrés'
        ]);
    }
    public function deleteSoftskills($id){
        $softskills = SoftSkills::find($id);
        if($softskills){
            $deleted_softskills = $softskills->softskills;
            DB::table('soft_skills')->delete($id);
            return response()->json([
                'message' => 'La compétence '.$deleted_softskills.' supprimée avec success'
            ]);
        }
    }
    public function deleteHardskills($id){
        $hardskills = HardSkills::find($id);
        if($hardskills){
            $deleted_hardskills = $hardskills->hardskills;
            DB::table('hard_skills')->delete($id);
            return response()->json([
                'message' => 'La compétence '.$deleted_hardskills.' supprimée avec success'
            ]);
        }
    }
    public function deleteLanguages($id){
        $language = Language::find($id);
        if($language){
            $deleted_language = $language->language;
            DB::table('languages')->delete($id);
            return response()->json([
                'message' => 'La langue '.$deleted_language.' supprimée avec success'
            ]);
        }
    }
    public function deleteHobbies($id){
        $hobbies = Hobbies::find($id);
        if($hobbies){
            $deleted_hobbies = $hobbies->hobbie;
            DB::table('hobbies')->delete($id);
            return response()->json([
                'message' => "Le centre d'intérêt ".$deleted_hobbies." supprimée avec success"
            ]);
        }
    }
    public function deleteEducation($id){
        $education = Education::find($id);
        if($education){
            $deleted_education = $education->certificate;
            DB::table('educations')->delete($id);
            return response()->json([
                'message' => "La formation ".$deleted_education." supprimée avec success"
            ]);
        }
    }
    public function deleteExperience($id){
        $experience = Experience::find($id);
        if($experience){
            $deleted_experience = $experience->entreprise;
            DB::table('experiences')->delete($id);
            return response()->json([
                'message' => "L'expérience ".$deleted_experience." supprimée avec success"
            ]);
        }
    }
}
